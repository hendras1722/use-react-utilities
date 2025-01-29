export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement';
export type UseMouseSourceType = 'mouse' | 'touch' | null;
export type UseMouseEventExtractor = (event: MouseEvent | Touch) => [x: number, y: number] | null | undefined;
export interface Position {
    x: number;
    y: number;
}
export interface UseMouseOptions {
    type?: UseMouseCoordType | UseMouseEventExtractor;
    target?: Window | EventTarget | null | undefined;
    touch?: boolean;
    scroll?: boolean;
    resetOnTouchEnds?: boolean;
    initialValue?: Position;
    eventFilter?: (handler: () => void, options: any) => void;
}
export declare function useMouse(options?: UseMouseOptions): {
    x: number;
    y: number;
    sourceType: UseMouseSourceType;
};
export type UseMouseReturn = ReturnType<typeof useMouse>;
