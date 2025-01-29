import { useEffect, useRef, useState } from 'react';
const UseMouseBuiltinExtractors = {
    page: (event) => [event.pageX, event.pageY],
    client: (event) => [event.clientX, event.clientY],
    screen: (event) => [event.screenX, event.screenY],
    movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY],
};
export function useMouse(options = {}) {
    const { type = 'page', touch = true, resetOnTouchEnds = false, initialValue = { x: 0, y: 0 }, target = typeof window !== 'undefined' ? window : null, scroll = true, eventFilter, } = options;
    const [x, setX] = useState(initialValue.x);
    const [y, setY] = useState(initialValue.y);
    const [sourceType, setSourceType] = useState(null);
    const prevMouseEvent = useRef(null);
    const prevScrollX = useRef(0);
    const prevScrollY = useRef(0);
    const extractor = typeof type === 'function' ? type : UseMouseBuiltinExtractors[type];
    useEffect(() => {
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
export function useMouseInElement(targetRef, options = {}) {
    const { handleOutside = true, type = 'page' } = options;
    const { x, y, sourceType } = useMouse(options);
    // Handle both RefObject and direct element
    const internalRef = useRef(null);
    const [elementX, setElementX] = useState(0);
    const [elementY, setElementY] = useState(0);
    const [elementPositionX, setElementPositionX] = useState(0);
    const [elementPositionY, setElementPositionY] = useState(0);
    const [elementHeight, setElementHeight] = useState(0);
    const [elementWidth, setElementWidth] = useState(0);
    const [isOutside, setIsOutside] = useState(true);
    // Update internal ref whenever target changes
    useEffect(() => {
        if (targetRef === null) {
            internalRef.current = document.body;
        }
        else if ('current' in targetRef) {
            internalRef.current = targetRef.current;
        }
        else {
            internalRef.current = targetRef;
        }
    }, [targetRef]);
    useEffect(() => {
        const updateElementInfo = () => {
            const el = internalRef.current;
            if (!el)
                return;
            const rect = el.getBoundingClientRect();
            const { left, top, width, height } = rect;
            const pageXOffset = window.pageXOffset;
            const pageYOffset = window.pageYOffset;
            const posX = left + (type === 'page' ? pageXOffset : 0);
            const posY = top + (type === 'page' ? pageYOffset : 0);
            setElementPositionX(posX);
            setElementPositionY(posY);
            setElementHeight(height);
            setElementWidth(width);
            const elX = x - posX;
            const elY = y - posY;
            const newIsOutside = x < left + pageXOffset ||
                x > left + width + pageXOffset ||
                y < top + pageYOffset ||
                y > top + height + pageYOffset;
            setIsOutside(newIsOutside);
            if (handleOutside || !newIsOutside) {
                setElementX(elX);
                setElementY(elY);
            }
        };
        const el = internalRef.current;
        if (!el)
            return;
        const handleMouseMove = () => {
            updateElementInfo();
        };
        const handleMouseEnter = () => {
            setIsOutside(false);
            updateElementInfo();
        };
        const handleMouseLeave = () => {
            setIsOutside(true);
            updateElementInfo();
        };
        // Add event listeners
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', updateElementInfo);
        window.addEventListener('resize', updateElementInfo);
        // Initial update
        updateElementInfo();
        return () => {
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', updateElementInfo);
            window.removeEventListener('resize', updateElementInfo);
        };
    }, [x, y, handleOutside, type, internalRef.current]);
    return {
        x,
        y,
        sourceType,
        elementX,
        elementY,
        elementPositionX,
        elementPositionY,
        elementHeight,
        elementWidth,
        isOutside,
    };
}
