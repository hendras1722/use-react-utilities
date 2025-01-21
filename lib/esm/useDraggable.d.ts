interface Position {
    x: number;
    y: number;
}
interface Boundaries {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
}
interface UseDraggableOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    containerElement?: HTMLElement | null;
    boundaries?: Boundaries;
    onStart?: (position: Position, event: PointerEvent) => void | false;
    onMove?: (position: Position, event: PointerEvent) => void;
    onEnd?: (position: Position, event: PointerEvent) => void;
}
export default function useDraggable(targetRef: React.RefObject<HTMLElement>, options?: UseDraggableOptions): {
    x: number;
    y: number;
    isDragging: boolean;
};
export {};
