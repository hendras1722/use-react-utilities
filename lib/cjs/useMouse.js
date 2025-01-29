"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMouse = useMouse;
const react_1 = require("react");
const useEventlistiner_1 = __importDefault(require("./useEventlistiner"));
// Constants
const DEFAULT_OPTIONS = {
    type: 'page',
    touch: true,
    resetOnTouchEnds: false,
    initialValue: { x: 0, y: 0 },
    target: typeof window !== 'undefined' ? window : null,
    scroll: true,
};
const BUILT_IN_EXTRACTORS = {
    page: (event) => [event.pageX, event.pageY],
    client: (event) => [event.clientX, event.clientY],
    screen: (event) => [event.screenX, event.screenY],
    movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY],
};
function useMouse(options = {}) {
    const { type = DEFAULT_OPTIONS.type, touch = DEFAULT_OPTIONS.touch, resetOnTouchEnds = DEFAULT_OPTIONS.resetOnTouchEnds, initialValue = DEFAULT_OPTIONS.initialValue, target = DEFAULT_OPTIONS.target, scroll = DEFAULT_OPTIONS.scroll, eventFilter, } = options;
    // State
    const [position, setPosition] = (0, react_1.useState)(initialValue);
    const [sourceType, setSourceType] = (0, react_1.useState)(null);
    // Refs
    const prevMouseEvent = (0, react_1.useRef)(null);
    const scrollPosition = (0, react_1.useRef)({ x: 0, y: 0 });
    // Utilities
    const extractor = typeof type === 'function' ? type : BUILT_IN_EXTRACTORS[type];
    const updatePosition = (x, y) => {
        setPosition({ x, y });
    };
    // Event Handlers
    const handleMouse = (event) => {
        const result = extractor(event);
        prevMouseEvent.current = event;
        if (result) {
            updatePosition(result[0], result[1]);
            setSourceType('mouse');
        }
        if (window) {
            scrollPosition.current = { x: window.scrollX, y: window.scrollY };
        }
    };
    const handleTouch = (event) => {
        if (event.touches.length > 0) {
            const result = extractor(event.touches[0]);
            if (result) {
                updatePosition(result[0], result[1]);
                setSourceType('touch');
            }
        }
    };
    const handleScroll = () => {
        if (!prevMouseEvent.current || !window)
            return;
        const pos = extractor(prevMouseEvent.current);
        if (prevMouseEvent.current instanceof MouseEvent && pos) {
            const scrollDelta = {
                x: window.scrollX - scrollPosition.current.x,
                y: window.scrollY - scrollPosition.current.y,
            };
            updatePosition(pos[0] + scrollDelta.x, pos[1] + scrollDelta.y);
        }
    };
    const resetPosition = () => {
        updatePosition(initialValue.x, initialValue.y);
    };
    // Event Handler Wrappers
    const wrapEventHandler = (handler) => (eventFilter
        ? (...args) => eventFilter(() => handler(...args), {})
        : handler);
    const mouseHandlerWrapper = wrapEventHandler(handleMouse);
    const touchHandlerWrapper = wrapEventHandler(handleTouch);
    const scrollHandlerWrapper = wrapEventHandler(handleScroll);
    // Effect for event listeners
    (0, react_1.useEffect)(() => {
        if (!target)
            return;
        const listenerOptions = { passive: true };
        const cleanupFunctions = [];
        // Mouse events
        const mouseCleanup = (0, useEventlistiner_1.default)(target, ['mousemove', 'dragover'], mouseHandlerWrapper, listenerOptions) ?? (() => { });
        cleanupFunctions.push(mouseCleanup);
        // Touch events
        if (touch && type !== 'movement') {
            const touchCleanup = (0, useEventlistiner_1.default)(target, ['touchstart', 'touchmove'], touchHandlerWrapper, listenerOptions) ?? (() => { });
            cleanupFunctions.push(touchCleanup);
            if (resetOnTouchEnds) {
                const touchEndCleanup = (0, useEventlistiner_1.default)(target, 'touchend', resetPosition, listenerOptions) ?? (() => { });
                cleanupFunctions.push(touchEndCleanup);
            }
        }
        // Scroll events
        if (scroll && type === 'page') {
            const scrollCleanup = (0, useEventlistiner_1.default)(window, 'scroll', scrollHandlerWrapper, listenerOptions) ?? (() => { });
            cleanupFunctions.push(scrollCleanup);
        }
        return () => cleanupFunctions.forEach((cleanup) => cleanup());
    }, [target, touch, type, resetOnTouchEnds, scroll]);
    return {
        x: position.x,
        y: position.y,
        sourceType,
    };
}
