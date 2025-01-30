import { useEffect, useRef, useState } from 'react'

// Types from previous implementation
export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement'
export type UseMouseSourceType = 'mouse' | 'touch' | null
export type UseMouseEventExtractor = (
  event: MouseEvent | Touch
) => [x: number, y: number] | null | undefined

export interface Position {
  x: number
  y: number
}

export interface UseMouseOptions {
  type?: UseMouseCoordType | UseMouseEventExtractor
  target?: Window | EventTarget | null
  touch?: boolean
  scroll?: boolean
  resetOnTouchEnds?: boolean
  initialValue?: Position
  eventFilter?: (handler: () => void, options: any) => void
}

const UseMouseBuiltinExtractors: Record<
  UseMouseCoordType,
  UseMouseEventExtractor
> = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) =>
    event instanceof Touch ? null : [event.movementX, event.movementY],
} as const

export function useMouse(options: UseMouseOptions = {}) {
  const {
    type = 'page',
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    target = typeof window !== 'undefined' ? window : null,
    scroll = true,
    eventFilter,
  } = options

  const [x, setX] = useState(initialValue.x)
  const [y, setY] = useState(initialValue.y)
  const [sourceType, setSourceType] = useState<UseMouseSourceType>(null)

  const prevMouseEvent = useRef<MouseEvent | null>(null)
  const prevScrollX = useRef(0)
  const prevScrollY = useRef(0)

  const extractor =
    typeof type === 'function' ? type : UseMouseBuiltinExtractors[type]

  useEffect(() => {
    if (!target) return

    const mouseHandler = (event: MouseEvent) => {
      const result = extractor(event)
      prevMouseEvent.current = event

      if (result) {
        setX(result[0])
        setY(result[1])
        setSourceType('mouse')
      }

      if (window) {
        prevScrollX.current = window.scrollX
        prevScrollY.current = window.scrollY
      }
    }

    const touchHandler = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const result = extractor(event.touches[0])
        if (result) {
          setX(result[0])
          setY(result[1])
          setSourceType('touch')
        }
      }
    }

    const scrollHandler = () => {
      if (!prevMouseEvent.current || !window) return
      const pos = extractor(prevMouseEvent.current)

      if (prevMouseEvent.current instanceof MouseEvent && pos) {
        setX(pos[0] + window.scrollX - prevScrollX.current)
        setY(pos[1] + window.scrollY - prevScrollY.current)
      }
    }

    const reset = () => {
      setX(initialValue.x)
      setY(initialValue.y)
    }

    const wrappedMouseHandler = eventFilter
      ? (event: MouseEvent) => eventFilter(() => mouseHandler(event), {} as any)
      : mouseHandler

    const wrappedTouchHandler = eventFilter
      ? (event: TouchEvent) => eventFilter(() => touchHandler(event), {} as any)
      : touchHandler

    const wrappedScrollHandler = eventFilter
      ? () => eventFilter(() => scrollHandler(), {} as any)
      : scrollHandler

    const options = { passive: true }

    target.addEventListener('mousemove', wrappedMouseHandler, options)
    target.addEventListener('dragover', wrappedMouseHandler, options)

    if (touch && type !== 'movement') {
      target.addEventListener('touchstart', wrappedTouchHandler, options)
      target.addEventListener('touchmove', wrappedTouchHandler, options)

      if (resetOnTouchEnds) {
        target.addEventListener('touchend', reset, options)
      }
    }

    if (scroll && type === 'page' && window) {
      window.addEventListener('scroll', wrappedScrollHandler, options)
    }

    return () => {
      target.removeEventListener('mousemove', wrappedMouseHandler)
      target.removeEventListener('dragover', wrappedMouseHandler)

      if (touch && type !== 'movement') {
        target.removeEventListener('touchstart', wrappedTouchHandler)
        target.removeEventListener('touchmove', wrappedTouchHandler)

        if (resetOnTouchEnds) {
          target.removeEventListener('touchend', reset)
        }
      }

      if (scroll && type === 'page' && window) {
        window.removeEventListener('scroll', wrappedScrollHandler)
      }
    }
  }, [target, touch, type, resetOnTouchEnds, scroll, eventFilter])

  return {
    x,
    y,
    sourceType,
  }
}

export interface MouseInElementOptions extends UseMouseOptions {
  handleOutside?: boolean
}

export type UseMouseReturn = ReturnType<typeof useMouse>
