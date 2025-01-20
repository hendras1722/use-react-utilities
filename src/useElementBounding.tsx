import { useState, useEffect, useCallback, RefObject } from 'react'

interface UseElementBoundingOptions {
  /**
   * Reset values to 0 on component unmounted
   *
   * @default true
   */
  reset?: boolean
  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean
  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean
  /**
   * Immediately call update on component mounted
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Timing to recalculate the bounding box
   *
   * @default 'sync'
   */
  updateTiming?: 'sync' | 'next-frame'
}

interface ElementBounding {
  height: number
  bottom: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}

const INITIAL_BOUNDS: ElementBounding = {
  height: 0,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}

/**
 * React hook for tracking the bounding box of an HTML element.
 */
const useElementBounding = (
  target: RefObject<HTMLElement>,
  options: UseElementBoundingOptions = {}
) => {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
    immediate = true,
    updateTiming = 'sync',
  } = options

  const [bounds, setBounds] = useState<ElementBounding>(INITIAL_BOUNDS)

  const recalculate = useCallback(() => {
    const el = target.current
    if (!el) {
      if (reset) {
        setBounds(INITIAL_BOUNDS)
      }
      return
    }

    const rect = el.getBoundingClientRect()
    setBounds({
      height: rect.height,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    })
  }, [target, reset])

  const update = useCallback(() => {
    if (updateTiming === 'sync') {
      recalculate()
    } else if (updateTiming === 'next-frame') {
      requestAnimationFrame(() => recalculate())
    }
  }, [recalculate, updateTiming])

  // Handle target changes
  useEffect(() => {
    update()
  }, [target.current]) // Add explicit dependency on target.current

  // ResizeObserver setup
  useEffect(() => {
    const el = target.current
    if (!el) return

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(update)
    })

    resizeObserver.observe(el)

    return () => {
      resizeObserver.disconnect()
    }
  }, [target.current, update])

  // MutationObserver setup
  useEffect(() => {
    const el = target.current
    if (!el) return

    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(update)
    })

    mutationObserver.observe(el, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [target.current, update])

  // Window scroll listener
  useEffect(() => {
    if (!windowScroll) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [windowScroll, update])

  // Window resize listener
  useEffect(() => {
    if (!windowResize) return

    let ticking = false
    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowResize, update])

  // Initial update
  useEffect(() => {
    if (immediate) {
      update()
    }
  }, [immediate, update])

  return {
    ...bounds,
    update,
  }
}

export type UseElementBoundingReturn = ReturnType<typeof useElementBounding>
export default useElementBounding
