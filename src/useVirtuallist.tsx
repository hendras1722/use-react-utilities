import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'

interface VirtualListOptions {
  containerHeight: number
  itemHeight?: number
  overscan?: number
}

export function useVirtualList<T>(
  items: T[],
  { containerHeight, itemHeight = 50, overscan = 5 }: VirtualListOptions
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    if (!items || items.length === 0)
      return {
        startIndex: 0,
        endIndex: 0,
        visibleItems: [],
        topPadding: 0,
        bottomPadding: 0,
      }

    const startIndex = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(
      startIndex + visibleCount + overscan,
      items.length
    )

    const topPadding = startIndex * itemHeight
    const bottomPadding = Math.max(0, (items.length - endIndex) * itemHeight)

    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      topPadding,
      bottomPadding,
    }
  }, [items, itemHeight, containerHeight, scrollTop, overscan])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const scrollTo = useCallback(
    (index: number) => {
      if (containerRef.current) {
        containerRef.current.scrollTop = index * itemHeight
      }
    },
    [itemHeight]
  )

  // Ensure smooth scrolling and complete list rendering
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container

      // Prevent default scroll behavior at top and bottom
      if (
        (e.deltaY < 0 && scrollTop === 0) ||
        (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight)
      ) {
        e.preventDefault()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

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
  }
}
