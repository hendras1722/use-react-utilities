type InfiniteScrollElement = HTMLElement | SVGElement | null | undefined;
interface UseInfiniteScrollOptions<T extends InfiniteScrollElement = InfiniteScrollElement> {
    /**
     * The minimum distance between the bottom of the element and the bottom of the viewport
     *
     * @default 0
     */
    distance?: number;
    /**
     * The direction in which to listen the scroll.
     *
     * @default 'bottom'
     */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /**
     * The interval time between two load more (to avoid too many invokes).
     *
     * @default 100
     */
    interval?: number;
    /**
     * A function that determines whether more content can be loaded for a specific element.
     * Should return `true` if loading more content is allowed for the given element,
     * and `false` otherwise.
     */
    canLoadMore?: (el: T) => boolean;
}
interface ScrollState {
    x: number;
    y: number;
    isScrolling: boolean;
    arrivedState: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
}
export default function useInfiniteScroll<T extends InfiniteScrollElement>(elementRef: React.RefObject<T>, onLoadMore: (state: ScrollState) => Promise<void> | void, options?: UseInfiniteScrollOptions<T>): {
    isLoading: boolean;
    reset: () => void;
    scrollState: ScrollState;
};
export {};
