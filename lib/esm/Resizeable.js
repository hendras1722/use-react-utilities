// components/resizeable.tsx
import React, { useEffect, useRef, useState } from 'react';
const ResizableComponent = ({ children, minSize = 20, onResize, initialWidth = 200, initialHeight = 100, enableResize = true, }) => {
    const [dimensions, setDimensions] = useState({
        width: initialWidth,
        height: initialHeight,
    });
    const [isResizing, setIsResizing] = useState(false);
    const resizableRef = useRef(null);
    const originalDimensions = useRef({
        width: 0,
        height: 0,
        mouseX: 0,
        mouseY: 0,
        position: '',
    });
    const startResize = (e, position) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent dragging while resizing
        setIsResizing(true);
        const element = resizableRef.current;
        if (!element)
            return;
        originalDimensions.current = {
            width: dimensions.width,
            height: dimensions.height,
            mouseX: e.pageX,
            mouseY: e.pageY,
            position,
        };
    };
    const resize = (e) => {
        if (!isResizing)
            return;
        const { width, height, mouseX, mouseY, position } = originalDimensions.current;
        const deltaX = e.pageX - mouseX;
        const deltaY = e.pageY - mouseY;
        let newWidth = width;
        let newHeight = height;
        switch (position) {
            case 'bottom-right':
                newWidth = Math.max(width + deltaX, minSize);
                newHeight = Math.max(height + deltaY, minSize);
                break;
            case 'bottom-left':
                newWidth = Math.max(width - deltaX, minSize);
                newHeight = Math.max(height + deltaY, minSize);
                break;
            case 'top-right':
                newWidth = Math.max(width + deltaX, minSize);
                newHeight = Math.max(height - deltaY, minSize);
                break;
            case 'top-left':
                newWidth = Math.max(width - deltaX, minSize);
                newHeight = Math.max(height - deltaY, minSize);
                break;
        }
        setDimensions({
            width: newWidth,
            height: newHeight,
        });
        onResize?.(newWidth, newHeight);
    };
    const stopResize = () => {
        setIsResizing(false);
    };
    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing]);
    return (React.createElement("div", { ref: resizableRef, style: {
            width: dimensions.width === 0 ? 'fit-content' : dimensions.width,
            height: dimensions.height === 0 ? 'fit-content' : dimensions.height,
            position: 'relative',
            minWidth: minSize,
            minHeight: minSize,
        } },
        React.createElement("div", { style: { width: '100%', height: '100%' } }, children),
        enableResize && (React.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-se-resize z-50", style: {
                bottom: '-5px',
                right: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'bottom-right') })),
        enableResize && (React.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-sw-resize z-50", style: {
                bottom: '-5px',
                left: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'bottom-left') })),
        enableResize && (React.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-ne-resize z-50", style: {
                top: '-5px',
                right: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'top-right') })),
        enableResize && (React.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-nw-resize z-50", style: {
                top: '-5px',
                left: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'top-left') }))));
};
export default ResizableComponent;
