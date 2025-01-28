import { useEffect, useRef, useState, useCallback, RefObject } from 'react'
import useSupported from './useSupported'

type MaybeElement = Element | null | undefined

interface ConfigurableWindow {
  window?: Window
}

interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: RefObject<Element> | null
  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: string
  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   * @default 0
   */
  threshold?: number | number[]
}

interface UseIntersectionObserverReturn {
  isSupported: boolean
  isActive: boolean
  pause: () => void
  resume: () => void
  stop: () => void
}

const defaultWindow = typeof window !== 'undefined' ? window : undefined

export function useIntersectionObserver(
  target: RefObject<Element>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root,
    rootMargin = '0px',
    threshold = 0,
    window = defaultWindow,
    immediate = true,
  } = options

  const isSupported = useSupported(
    () => window && 'IntersectionObserver' in window
  )
  const [isActive, setIsActive] = useState(immediate)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetsRef = useRef<MaybeElement[]>([])

  const getTargets = useCallback(() => {
    if (Array.isArray(target)) {
      return target
        .map((t) => (t && 'current' in t ? t.current : t))
        .filter(Boolean)
    }
    const singleTarget = target && 'current' in target ? target.current : target
    return singleTarget ? [singleTarget] : []
  }, [target])

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isSupported || !isActive) return

    const targets = getTargets()
    if (targets.length === 0) return

    cleanup()

    const rootElement = root && 'current' in root ? root.current : root

    observerRef.current = new IntersectionObserver(callback, {
      root: rootElement,
      rootMargin,
      threshold,
    })

    targets.forEach((el) => {
      if (el) observerRef.current?.observe(el)
    })

    targetsRef.current = targets

    return cleanup
  }, [
    isSupported,
    isActive,
    root,
    rootMargin,
    threshold,
    callback,
    cleanup,
    getTargets,
  ])

  const stop = useCallback(() => {
    cleanup()
    setIsActive(false)
  }, [cleanup])

  const pause = useCallback(() => {
    cleanup()
    setIsActive(false)
  }, [cleanup])

  const resume = useCallback(() => {
    setIsActive(true)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    isSupported,
    isActive,
    pause,
    resume,
    stop,
  }
}
