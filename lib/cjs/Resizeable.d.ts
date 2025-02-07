import React from 'react';
interface ResizableProps {
    children: React.ReactNode;
    minSize?: number;
    onResize?: (width: number, height: number) => void;
    initialWidth?: number;
    initialHeight?: number;
    enableResize?: boolean;
}
declare const ResizableComponent: React.FC<ResizableProps>;
export default ResizableComponent;
