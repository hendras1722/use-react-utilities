import useEventListener from './useEventlistiner';
import { useCallback, useRef } from 'react';
let _iOSWorkaround = false;
/**
 * React hook to listen for clicks outside of an element.
 *
 * @param handler - Callback function to run when a click outside is detected
 * @param options - Configuration options
 * @returns ref to be attached to the target element
 */
export function useClickOutside(handler, options = {}) {
    const { ignore = [], capture = true, detectIframe = false } = options;
    const targetRef = useRef(null);
    const shouldListenRef = useRef(true);
    // iOS Workaround
    if (typeof window !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.platform) &&
        !_iOSWorkaround) {
        _iOSWorkaround = true;
        const listenerOptions = { passive: true };
        Array.from(document.body.children).forEach((el) => {
            useEventListener(el, 'click', () => { }, listenerOptions);
        });
        useEventListener(document.documentElement, 'click', () => { }, listenerOptions);
    }
    const shouldIgnore = useCallback((event) => {
        return ignore.some((target) => {
            if (typeof target === 'string') {
                return Array.from(document.querySelectorAll(target)).some((el) => el === event.target || event.composedPath().includes(el));
            }
            else {
                return (target &&
                    (event.target === target || event.composedPath().includes(target)));
            }
        });
    }, [ignore]);
    const listener = useCallback((event) => {
        const el = targetRef.current;
        if (!event.target)
            return;
        if (!el || el === event.target || event.composedPath().includes(el))
            return;
        if (event.detail === 0) {
            shouldListenRef.current = !shouldIgnore(event);
        }
        if (!shouldListenRef.current) {
            shouldListenRef.current = true;
            return;
        }
        handler(event);
    }, [handler, shouldIgnore]);
    const isProcessingClickRef = useRef(false);
    useEventListener(window, 'click', (event) => {
        if (!isProcessingClickRef.current) {
            isProcessingClickRef.current = true;
            setTimeout(() => {
                isProcessingClickRef.current = false;
            }, 0);
            listener(event);
        }
    }, { passive: true, capture });
    useEventListener(window, 'pointerdown', (e) => {
        const el = targetRef.current;
        shouldListenRef.current =
            !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true });
    if (detectIframe) {
        useEventListener(window, 'blur', (event) => {
            setTimeout(() => {
                const el = targetRef.current;
                if (document.activeElement?.tagName === 'IFRAME' &&
                    !el?.contains(document.activeElement)) {
                    handler(event);
                }
            }, 0);
        }, { passive: true });
    }
    return targetRef;
}
