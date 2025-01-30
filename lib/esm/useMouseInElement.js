import { useEffect, useRef, useState } from 'react';
import { useMouse } from './useMouse';
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
            const pageXOffset = window.scrollX;
            const pageYOffset = window.scrollY;
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
