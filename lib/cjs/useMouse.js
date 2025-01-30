"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMouse = useMouse;
const react_1 = require("react");
const UseMouseBuiltinExtractors = {
    page: (event) => [event.pageX, event.pageY],
    client: (event) => [event.clientX, event.clientY],
    screen: (event) => [event.screenX, event.screenY],
    movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY],
};
function useMouse(options = {}) {
    const { type = 'page', touch = true, resetOnTouchEnds = false, initialValue = { x: 0, y: 0 }, target = typeof window !== 'undefined' ? window : null, scroll = true, eventFilter, } = options;
    const [x, setX] = (0, react_1.useState)(initialValue.x);
    const [y, setY] = (0, react_1.useState)(initialValue.y);
    const [sourceType, setSourceType] = (0, react_1.useState)(null);
    const prevMouseEvent = (0, react_1.useRef)(null);
    const prevScrollX = (0, react_1.useRef)(0);
    const prevScrollY = (0, react_1.useRef)(0);
    const extractor = typeof type === 'function' ? type : UseMouseBuiltinExtractors[type];
    (0, react_1.useEffect)(() => {
        if (!target)
            return;
        const mouseHandler = (event) => {
            const result = extractor(event);
            prevMouseEvent.current = event;
            if (result) {
                setX(result[0]);
                setY(result[1]);
                setSourceType('mouse');
            }
            if (window) {
                prevScrollX.current = window.scrollX;
                prevScrollY.current = window.scrollY;
            }
        };
        const touchHandler = (event) => {
            if (event.touches.length > 0) {
                const result = extractor(event.touches[0]);
                if (result) {
                    setX(result[0]);
                    setY(result[1]);
                    setSourceType('touch');
                }
            }
        };
        const scrollHandler = () => {
            if (!prevMouseEvent.current || !window)
                return;
            const pos = extractor(prevMouseEvent.current);
            if (prevMouseEvent.current instanceof MouseEvent && pos) {
                setX(pos[0] + window.scrollX - prevScrollX.current);
                setY(pos[1] + window.scrollY - prevScrollY.current);
            }
        };
        const reset = () => {
            setX(initialValue.x);
            setY(initialValue.y);
        };
        const wrappedMouseHandler = eventFilter
            ? (event) => eventFilter(() => mouseHandler(event), {})
            : mouseHandler;
        const wrappedTouchHandler = eventFilter
            ? (event) => eventFilter(() => touchHandler(event), {})
            : touchHandler;
        const wrappedScrollHandler = eventFilter
            ? () => eventFilter(() => scrollHandler(), {})
            : scrollHandler;
        const options = { passive: true };
        target.addEventListener('mousemove', wrappedMouseHandler, options);
        target.addEventListener('dragover', wrappedMouseHandler, options);
        if (touch && type !== 'movement') {
            target.addEventListener('touchstart', wrappedTouchHandler, options);
            target.addEventListener('touchmove', wrappedTouchHandler, options);
            if (resetOnTouchEnds) {
                target.addEventListener('touchend', reset, options);
            }
        }
        if (scroll && type === 'page' && window) {
            window.addEventListener('scroll', wrappedScrollHandler, options);
        }
        return () => {
            target.removeEventListener('mousemove', wrappedMouseHandler);
            target.removeEventListener('dragover', wrappedMouseHandler);
            if (touch && type !== 'movement') {
                target.removeEventListener('touchstart', wrappedTouchHandler);
                target.removeEventListener('touchmove', wrappedTouchHandler);
                if (resetOnTouchEnds) {
                    target.removeEventListener('touchend', reset);
                }
            }
            if (scroll && type === 'page' && window) {
                window.removeEventListener('scroll', wrappedScrollHandler);
            }
        };
    }, [target, touch, type, resetOnTouchEnds, scroll, eventFilter]);
    return {
        x,
        y,
        sourceType,
    };
}
