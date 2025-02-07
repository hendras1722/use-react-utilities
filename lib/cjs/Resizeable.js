"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// components/resizeable.tsx
const react_1 = __importStar(require("react"));
const ResizableComponent = ({ children, minSize = 20, onResize, initialWidth = 200, initialHeight = 100, enableResize = true, }) => {
    const [dimensions, setDimensions] = (0, react_1.useState)({
        width: initialWidth,
        height: initialHeight,
    });
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const resizableRef = (0, react_1.useRef)(null);
    const originalDimensions = (0, react_1.useRef)({
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
    (0, react_1.useEffect)(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing]);
    return (react_1.default.createElement("div", { ref: resizableRef, style: {
            width: dimensions.width === 0 ? 'fit-content' : dimensions.width,
            height: dimensions.height === 0 ? 'fit-content' : dimensions.height,
            position: 'relative',
            minWidth: minSize,
            minHeight: minSize,
        } },
        react_1.default.createElement("div", { style: { width: '100%', height: '100%' } }, children),
        enableResize && (react_1.default.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-se-resize z-50", style: {
                bottom: '-5px',
                right: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'bottom-right') })),
        enableResize && (react_1.default.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-sw-resize z-50", style: {
                bottom: '-5px',
                left: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'bottom-left') })),
        enableResize && (react_1.default.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-ne-resize z-50", style: {
                top: '-5px',
                right: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'top-right') })),
        enableResize && (react_1.default.createElement("button", { className: "absolute w-3 h-3 bg-blue-500 hover:bg-blue-600 cursor-nw-resize z-50", style: {
                top: '-5px',
                left: '-5px',
                borderRadius: '50%',
                pointerEvents: 'auto',
            }, onClick: (e) => e.stopPropagation(), onMouseDown: (e) => startResize(e, 'top-left') }))));
};
exports.default = ResizableComponent;
