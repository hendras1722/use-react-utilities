"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClickOutside = useClickOutside;
const useEventlistiner_1 = __importDefault(require("./useEventlistiner"));
const react_1 = require("react");
let _iOSWorkaround = false;
/**
 * React hook to listen for clicks outside of an element.
 *
 * @param handler - Callback function to run when a click outside is detected
 * @param options - Configuration options
 * @returns ref to be attached to the target element
 */
function useClickOutside(handler, options = {}) {
    const { ignore = [], capture = true, detectIframe = false } = options;
    const targetRef = (0, react_1.useRef)(null);
    const shouldListenRef = (0, react_1.useRef)(true);
    // iOS Workaround
    if (typeof window !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.platform) &&
        !_iOSWorkaround) {
        _iOSWorkaround = true;
        const listenerOptions = { passive: true };
        Array.from(document.body.children).forEach((el) => {
            (0, useEventlistiner_1.default)(el, 'click', () => { }, listenerOptions);
        });
        (0, useEventlistiner_1.default)(document.documentElement, 'click', () => { }, listenerOptions);
    }
    const shouldIgnore = (0, react_1.useCallback)((event) => {
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
    const listener = (0, react_1.useCallback)((event) => {
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
    const isProcessingClickRef = (0, react_1.useRef)(false);
    (0, useEventlistiner_1.default)(window, 'click', (event) => {
        if (!isProcessingClickRef.current) {
            isProcessingClickRef.current = true;
            setTimeout(() => {
                isProcessingClickRef.current = false;
            }, 0);
            listener(event);
        }
    }, { passive: true, capture });
    (0, useEventlistiner_1.default)(window, 'pointerdown', (e) => {
        const el = targetRef.current;
        shouldListenRef.current =
            !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
    }, { passive: true });
    if (detectIframe) {
        (0, useEventlistiner_1.default)(window, 'blur', (event) => {
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
