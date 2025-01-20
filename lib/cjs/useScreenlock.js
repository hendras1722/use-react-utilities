"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Helper to check if running on iOS
const isIOS = typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    (/iP(ad|hone|od)/.test(window.navigator.platform) ||
        (window.navigator.platform === 'MacIntel' &&
            window.navigator.maxTouchPoints > 1));
function checkOverflowScroll(ele) {
    const style = window.getComputedStyle(ele);
    if (style.overflowX === 'scroll' ||
        style.overflowY === 'scroll' ||
        (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth) ||
        (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)) {
        return true;
    }
    else {
        const parent = ele.parentNode;
        if (!parent || parent.tagName === 'BODY') {
            return false;
        }
        return checkOverflowScroll(parent);
    }
}
function preventDefault(rawEvent) {
    const e = rawEvent || window.event;
    const target = e.target;
    // Do not prevent if element or parentNodes have overflow: scroll set.
    if (checkOverflowScroll(target)) {
        return false;
    }
    // Do not prevent if the event has more than one touch
    if (e.touches.length > 1) {
        return true;
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}
const elInitialOverflow = new WeakMap();
function useScrollLock(elementRef, initialState = false) {
    const [isLocked, setIsLocked] = (0, react_1.useState)(initialState);
    const initialOverflowRef = (0, react_1.useRef)('');
    const touchMoveListenerRef = (0, react_1.useRef)(null);
    const getElement = (0, react_1.useCallback)(() => {
        if (!elementRef)
            return null;
        if ('current' in elementRef)
            return elementRef.current;
        return elementRef;
    }, [elementRef]);
    (0, react_1.useCallback)(() => {
        const el = getElement();
        if (!el || isLocked)
            return;
        if (!elInitialOverflow.get(el)) {
            elInitialOverflow.set(el, el.style.overflow);
        }
        initialOverflowRef.current = el.style.overflow;
        if (isIOS) {
            const handleTouchMove = (e) => preventDefault(e);
            el.addEventListener('touchmove', handleTouchMove, { passive: false });
            touchMoveListenerRef.current = () => {
                el.removeEventListener('touchmove', handleTouchMove);
            };
        }
        el.style.overflow = 'hidden';
        setIsLocked(true);
    }, [getElement, isLocked]);
    const unlock = (0, react_1.useCallback)(() => {
        const el = getElement();
        if (!el || !isLocked)
            return;
        if (isIOS && touchMoveListenerRef.current) {
            touchMoveListenerRef.current();
            touchMoveListenerRef.current = null;
        }
        el.style.overflow = initialOverflowRef.current;
        elInitialOverflow.delete(el);
        setIsLocked(false);
    }, [getElement, isLocked]);
    (0, react_1.useEffect)(() => {
        const el = getElement();
        if (!el)
            return;
        if (!elInitialOverflow.get(el)) {
            elInitialOverflow.set(el, el.style.overflow);
        }
        if (el.style.overflow !== 'hidden') {
            initialOverflowRef.current = el.style.overflow;
        }
        if (el.style.overflow === 'hidden') {
            setIsLocked(true);
            return;
        }
        if (isLocked) {
            el.style.overflow = 'hidden';
        }
        return () => {
            unlock();
        };
    }, [getElement, isLocked, unlock]);
    return [isLocked, setIsLocked];
}
exports.default = useScrollLock;
