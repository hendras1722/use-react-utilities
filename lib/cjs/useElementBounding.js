"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const INITIAL_BOUNDS = {
    height: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
};
/**
 * React hook for tracking the bounding box of an HTML element.
 */
const useElementBounding = (target, options = {}) => {
    const { reset = true, windowResize = true, windowScroll = true, immediate = true, updateTiming = 'sync', } = options;
    const [bounds, setBounds] = (0, react_1.useState)(INITIAL_BOUNDS);
    const recalculate = (0, react_1.useCallback)(() => {
        const el = target.current;
        if (!el) {
            if (reset) {
                setBounds(INITIAL_BOUNDS);
            }
            return;
        }
        const rect = el.getBoundingClientRect();
        setBounds({
            height: rect.height,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
            x: rect.x,
            y: rect.y,
        });
    }, [target, reset]);
    const update = (0, react_1.useCallback)(() => {
        if (updateTiming === 'sync') {
            recalculate();
        }
        else if (updateTiming === 'next-frame') {
            requestAnimationFrame(() => recalculate());
        }
    }, [recalculate, updateTiming]);
    // Handle target changes
    (0, react_1.useEffect)(() => {
        update();
    }, [target.current]); // Add explicit dependency on target.current
    // ResizeObserver setup
    (0, react_1.useEffect)(() => {
        const el = target.current;
        if (!el)
            return;
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(update);
        });
        resizeObserver.observe(el);
        return () => {
            resizeObserver.disconnect();
        };
    }, [target.current, update]);
    // MutationObserver setup
    (0, react_1.useEffect)(() => {
        const el = target.current;
        if (!el)
            return;
        const mutationObserver = new MutationObserver(() => {
            requestAnimationFrame(update);
        });
        mutationObserver.observe(el, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        });
        return () => {
            mutationObserver.disconnect();
        };
    }, [target.current, update]);
    // Window scroll listener
    (0, react_1.useEffect)(() => {
        if (!windowScroll)
            return;
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, {
            capture: true,
            passive: true,
        });
        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, [windowScroll, update]);
    // Window resize listener
    (0, react_1.useEffect)(() => {
        if (!windowResize)
            return;
        let ticking = false;
        const handleResize = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowResize, update]);
    // Initial update
    (0, react_1.useEffect)(() => {
        if (immediate) {
            update();
        }
    }, [immediate, update]);
    return {
        ...bounds,
        update,
    };
};
exports.default = useElementBounding;
