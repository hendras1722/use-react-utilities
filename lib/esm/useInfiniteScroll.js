import { useCallback, useEffect, useRef, useState } from 'react';
export default function useInfiniteScroll(elementRef, onLoadMore, options = {}) {
    const { direction = 'bottom', interval = 100, canLoadMore = () => true, distance = 0, } = options;
    const [isLoading, setIsLoading] = useState(false);
    const [scrollState, setScrollState] = useState({
        x: 0,
        y: 0,
        isScrolling: false,
        arrivedState: {
            top: false,
            bottom: false,
            left: false,
            right: false,
        },
    });
    const timeoutRef = useRef(null);
    const loadingPromiseRef = useRef(null);
    const isScrollingRef = useRef(false);
    const measureScrollState = useCallback(() => {
        const element = elementRef.current;
        if (!element)
            return;
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth, } = element;
        const arrivedState = {
            top: scrollTop <= distance,
            bottom: scrollTop + clientHeight >= scrollHeight - distance,
            left: scrollLeft <= distance,
            right: scrollLeft + clientWidth >= scrollWidth - distance,
        };
        setScrollState((prev) => ({
            ...prev,
            x: scrollLeft,
            y: scrollTop,
            arrivedState,
        }));
        return arrivedState;
    }, [distance, elementRef]);
    const checkAndLoad = useCallback(async () => {
        const element = elementRef.current;
        if (!element || !canLoadMore(element) || isLoading)
            return;
        const { scrollHeight, clientHeight, scrollWidth, clientWidth } = element;
        const isNarrower = direction === 'bottom' || direction === 'top'
            ? scrollHeight <= clientHeight
            : scrollWidth <= clientWidth;
        const currentArrivedState = measureScrollState();
        if (currentArrivedState?.[direction] || isNarrower) {
            if (!loadingPromiseRef.current && !isLoading) {
                setIsLoading(true);
                try {
                    await Promise.all([
                        onLoadMore(scrollState),
                        new Promise((resolve) => setTimeout(resolve, interval)),
                    ]);
                }
                finally {
                    setIsLoading(false);
                    loadingPromiseRef.current = null;
                    // Check again after loading completes
                    if (elementRef.current) {
                        const newState = measureScrollState();
                        if (newState?.[direction]) {
                            setTimeout(() => checkAndLoad(), 0);
                        }
                    }
                }
            }
        }
    }, [
        direction,
        elementRef,
        interval,
        onLoadMore,
        scrollState,
        canLoadMore,
        isLoading,
        measureScrollState,
    ]);
    useEffect(() => {
        const element = elementRef.current;
        if (!element)
            return;
        const handleScroll = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                setScrollState((prev) => ({ ...prev, isScrolling: true }));
            }
            measureScrollState();
            checkAndLoad();
            timeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
                setScrollState((prev) => ({ ...prev, isScrolling: false }));
            }, 100);
        };
        const observer = new ResizeObserver(() => {
            measureScrollState();
            checkAndLoad();
        });
        element.addEventListener('scroll', handleScroll, { passive: true });
        observer.observe(element);
        // Initial check
        measureScrollState();
        checkAndLoad();
        return () => {
            element.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [elementRef, measureScrollState, checkAndLoad]);
    const reset = useCallback(() => {
        loadingPromiseRef.current = null;
        setIsLoading(false);
        measureScrollState();
        checkAndLoad();
    }, [measureScrollState, checkAndLoad]);
    return {
        isLoading,
        reset,
        scrollState,
    };
}
