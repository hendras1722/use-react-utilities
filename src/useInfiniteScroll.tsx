import { useCallback, useEffect, useRef, useState } from 'react'

type InfiniteScrollElement = HTMLElement | SVGElement | null | undefined

interface UseInfiniteScrollOptions<
  T extends InfiniteScrollElement = InfiniteScrollElement
> {
  distance?: number
  direction?: 'top' | 'bottom' | 'left' | 'right'
  interval?: number
  canLoadMore?: (el: T) => boolean
}

interface ScrollState {
  x: number
  y: number
  isScrolling: boolean
  arrivedState: {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
  }
}

export default function useInfiniteScroll<T extends InfiniteScrollElement>(
  elementRef: React.RefObject<T>,
  onLoadMore: (state: ScrollState) => Promise<void> | void,
  options: UseInfiniteScrollOptions<T> = {}
) {
  const {
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
    distance = 0,
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollStateRef = useRef<ScrollState>({
    x: 0,
    y: 0,
    isScrolling: false,
    arrivedState: {
      top: false,
      bottom: false,
      left: false,
      right: false,
    },
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const loadingPromiseRef = useRef<Promise<void[]> | null>(null)
  const isScrollingRef = useRef(false)

  const measureScrollState = useCallback(() => {
    const element = elementRef.current
    if (!element) return null

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = element

    const arrivedState = {
      top: scrollTop <= distance,
      bottom: scrollTop + clientHeight >= scrollHeight - distance,
      left: scrollLeft <= distance,
      right: scrollLeft + clientWidth >= scrollWidth - distance,
    }

    scrollStateRef.current = {
      ...scrollStateRef.current,
      x: scrollLeft,
      y: scrollTop,
      isScrolling,
      arrivedState,
    }

    return arrivedState
  }, [distance, elementRef, isScrolling])

  const checkAndLoad = useCallback(
    async (force = false) => {
      const element = elementRef.current
      if (!element || (!force && !canLoadMore(element as T)) || isLoading)
        return

      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = element
      const isNarrower =
        direction === 'bottom' || direction === 'top'
          ? scrollHeight <= clientHeight
          : scrollWidth <= clientWidth

      const currentArrivedState = measureScrollState()

      if (currentArrivedState?.[direction] || isNarrower) {
        if (!loadingPromiseRef.current && !isLoading) {
          setIsLoading(true)

          try {
            const loadMorePromise = onLoadMore(scrollStateRef.current)
            const delayPromise = new Promise<void>((resolve) =>
              setTimeout(resolve, interval)
            )

            loadingPromiseRef.current = Promise.all([
              loadMorePromise,
              delayPromise,
            ]) as Promise<void[]>

            await loadingPromiseRef.current
          } finally {
            setIsLoading(false)
            loadingPromiseRef.current = null

            // Use RAF to avoid immediate re-check
            if (elementRef.current) {
              requestAnimationFrame(() => {
                const newState = measureScrollState()
                if (newState?.[direction]) {
                  checkAndLoad(true)
                }
              })
            }
          }
        }
      }
    },
    [
      direction,
      elementRef,
      interval,
      onLoadMore,
      canLoadMore,
      isLoading,
      measureScrollState,
    ]
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let scrollRAF: number

    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        setIsScrolling(true)
      }

      // Use RAF for scroll measurements
      cancelAnimationFrame(scrollRAF)
      scrollRAF = requestAnimationFrame(() => {
        measureScrollState()
        checkAndLoad()
      })

      timeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
        setIsScrolling(false)
      }, 100)
    }

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(scrollRAF)
      scrollRAF = requestAnimationFrame(() => {
        measureScrollState()
        checkAndLoad()
      })
    })

    element.addEventListener('scroll', handleScroll, { passive: true })
    observer.observe(element)

    // Initial check with RAF
    requestAnimationFrame(() => {
      measureScrollState()
      checkAndLoad()
    })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      cancelAnimationFrame(scrollRAF)
    }
  }, [elementRef, measureScrollState, checkAndLoad])

  const reset = useCallback(() => {
    loadingPromiseRef.current = null
    setIsLoading(false)
    requestAnimationFrame(() => {
      measureScrollState()
      checkAndLoad(true)
    })
  }, [measureScrollState, checkAndLoad])

  return {
    isLoading,
    reset,
    scrollState: scrollStateRef.current,
  }
}
