import { useEffect, useRef, useState, useCallback } from 'react'

// Helper to check if running on iOS
const isIOS =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  (/iP(ad|hone|od)/.test(window.navigator.platform) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1))

function checkOverflowScroll(ele: Element): boolean {
  const style = window.getComputedStyle(ele)
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth) ||
    (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)
  ) {
    return true
  } else {
    const parent = ele.parentNode as Element
    if (!parent || parent.tagName === 'BODY') {
      return false
    }
    return checkOverflowScroll(parent)
  }
}

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event
  const target = e.target as Element

  // Do not prevent if element or parentNodes have overflow: scroll set.
  if (checkOverflowScroll(target)) {
    return false
  }

  // Do not prevent if the event has more than one touch
  if (e.touches.length > 1) {
    return true
  }

  if (e.preventDefault) {
    e.preventDefault()
  }

  return false
}

const elInitialOverflow = new WeakMap<HTMLElement, string>()

type ElementType = HTMLElement | SVGElement | null | undefined

export default function useScrollLock(
  elementRef: React.RefObject<ElementType> | ElementType,
  initialState = false
) {
  const [isLocked, setIsLocked] = useState(initialState)
  const initialOverflowRef = useRef<string>('')
  const touchMoveListenerRef = useRef<(() => void) | null>(null)

  const getElement = useCallback((): HTMLElement | null => {
    if (!elementRef) return null
    if ('current' in elementRef) return elementRef.current as HTMLElement
    return elementRef as HTMLElement
  }, [elementRef])

  useCallback(() => {
    const el = getElement()
    if (!el || isLocked) return

    if (!elInitialOverflow.get(el)) {
      elInitialOverflow.set(el, el.style.overflow)
    }

    initialOverflowRef.current = el.style.overflow

    if (isIOS) {
      const handleTouchMove = (e: TouchEvent) => preventDefault(e)
      el.addEventListener('touchmove', handleTouchMove, { passive: false })
      touchMoveListenerRef.current = () => {
        el.removeEventListener('touchmove', handleTouchMove)
      }
    }

    el.style.overflow = 'hidden'
    setIsLocked(true)
  }, [getElement, isLocked])

  const unlock = useCallback(() => {
    const el = getElement()
    if (!el || !isLocked) return

    if (isIOS && touchMoveListenerRef.current) {
      touchMoveListenerRef.current()
      touchMoveListenerRef.current = null
    }

    el.style.overflow = initialOverflowRef.current
    elInitialOverflow.delete(el)
    setIsLocked(false)
  }, [getElement, isLocked])

  useEffect(() => {
    const el = getElement()
    if (!el) return

    if (!elInitialOverflow.get(el)) {
      elInitialOverflow.set(el, el.style.overflow)
    }

    if (el.style.overflow !== 'hidden') {
      initialOverflowRef.current = el.style.overflow
    }

    if (el.style.overflow === 'hidden') {
      setIsLocked(true)
      return
    }

    if (isLocked) {
      el.style.overflow = 'hidden'
    }

    return () => {
      unlock()
    }
  }, [getElement, isLocked, unlock])

  return [isLocked, setIsLocked] as const
}
