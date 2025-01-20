import { RefObject } from 'react';
interface UseElementBoundingOptions {
    /**
     * Reset values to 0 on component unmounted
     *
     * @default true
     */
    reset?: boolean;
    /**
     * Listen to window resize event
     *
     * @default true
     */
    windowResize?: boolean;
    /**
     * Listen to window scroll event
     *
     * @default true
     */
    windowScroll?: boolean;
    /**
     * Immediately call update on component mounted
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * Timing to recalculate the bounding box
     *
     * @default 'sync'
     */
    updateTiming?: 'sync' | 'next-frame';
}
/**
 * React hook for tracking the bounding box of an HTML element.
 */
declare const useElementBounding: (target: RefObject<HTMLElement>, options?: UseElementBoundingOptions) => {
    update: () => void;
    height: number;
    bottom: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
};
export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>;
export default useElementBounding;
