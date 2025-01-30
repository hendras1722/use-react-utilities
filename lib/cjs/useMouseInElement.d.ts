import { RefObject } from 'react';
import { useMouse } from './useMouse';
export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement';
export type UseMouseSourceType = 'mouse' | 'touch' | null;
export type UseMouseEventExtractor = (event: MouseEvent | Touch) => [x: number, y: number] | null | undefined;
export interface Position {
    x: number;
    y: number;
}
export interface UseMouseOptions {
    type?: UseMouseCoordType | UseMouseEventExtractor;
    target?: Window | EventTarget | null;
    touch?: boolean;
    scroll?: boolean;
    resetOnTouchEnds?: boolean;
    initialValue?: Position;
    eventFilter?: (handler: () => void, options: any) => void;
}
export interface MouseInElementOptions extends UseMouseOptions {
    handleOutside?: boolean;
}
export declare function useMouseInElement(targetRef: RefObject<HTMLElement> | HTMLElement | null, options?: MouseInElementOptions): {
    x: number;
    y: number;
    sourceType: import("./useMouse").UseMouseSourceType;
    elementX: number;
    elementY: number;
    elementPositionX: number;
    elementPositionY: number;
    elementHeight: number;
    elementWidth: number;
    isOutside: boolean;
};
export type UseMouseReturn = ReturnType<typeof useMouse>;
export type UseMouseInElementReturn = ReturnType<typeof useMouseInElement>;
