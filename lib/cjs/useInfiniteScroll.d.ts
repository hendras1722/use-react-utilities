type InfiniteScrollElement = HTMLElement | SVGElement | null | undefined;
interface UseInfiniteScrollOptions<T extends InfiniteScrollElement = InfiniteScrollElement> {
    distance?: number;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    interval?: number;
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
