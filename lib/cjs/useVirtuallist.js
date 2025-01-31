"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVirtualList = useVirtualList;
const react_1 = require("react");
function useVirtualList(items, { containerHeight, itemHeight = 50, overscan = 5 }) {
    const containerRef = (0, react_1.useRef)(null);
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    const visibleRange = (0, react_1.useMemo)(() => {
        if (!items || items.length === 0)
            return {
                startIndex: 0,
                endIndex: 0,
                visibleItems: [],
                topPadding: 0,
                bottomPadding: 0,
            };
        const startIndex = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount + overscan, items.length);
        const topPadding = startIndex * itemHeight;
        const bottomPadding = Math.max(0, (items.length - endIndex) * itemHeight);
        return {
            startIndex,
            endIndex,
            visibleItems: items.slice(startIndex, endIndex),
            topPadding,
            bottomPadding,
        };
    }, [items, itemHeight, containerHeight, scrollTop, overscan]);
    const handleScroll = (0, react_1.useCallback)((e) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);
    const scrollTo = (0, react_1.useCallback)((index) => {
        if (containerRef.current) {
            containerRef.current.scrollTop = index * itemHeight;
        }
    }, [itemHeight]);
    // Ensure smooth scrolling and complete list rendering
    (0, react_1.useEffect)(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const handleWheel = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Prevent default scroll behavior at top and bottom
            if ((e.deltaY < 0 && scrollTop === 0) ||
                (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight)) {
                e.preventDefault();
            }
        };
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);
    return {
        ref: containerRef,
        handleScroll,
        scrollTo,
        items: visibleRange.visibleItems,
        startIndex: visibleRange.startIndex,
        styleContainer: {
            height: `${containerHeight}px`,
            overscrollBehavior: 'contain',
            overflow: 'auto',
        },
        styleList: {
            paddingTop: `${visibleRange.topPadding}px`,
            paddingBottom: `${visibleRange.bottomPadding}px`,
        },
        topPadding: visibleRange.topPadding,
        bottomPadding: visibleRange.bottomPadding,
    };
}
