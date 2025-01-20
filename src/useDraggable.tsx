'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// type PointerType = 'mouse' | 'touch' | 'pen'

interface Position {
  x: number
  y: number
}

interface Boundaries {
  minX?: number
  maxX?: number
  minY?: number
  maxY?: number
}

interface UseDraggableOptions {
  preventDefault?: boolean
  stopPropagation?: boolean
  containerElement?: HTMLElement | null
  boundaries?: Boundaries
  onStart?: (position: Position, event: PointerEvent) => void | false
  onMove?: (position: Position, event: PointerEvent) => void
  onEnd?: (position: Position, event: PointerEvent) => void
}

export default function useDraggable(
  targetRef: React.RefObject<HTMLElement>,
  options: UseDraggableOptions = {}
) {
  const {
    preventDefault = true,
    stopPropagation = true,
    containerElement,
    boundaries,
    onStart,
    onMove,
    onEnd,
  } = options

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position | null>(null)
  const initialPositionRef = useRef<Position>({ x: 0, y: 0 })

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      const target = targetRef.current
      if (!target) return

      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
      }

      initialPositionRef.current = {
        x: position.x,
        y: position.y,
      }

      if (onStart) {
        const startPos = { x: position.x, y: position.y }
        if (onStart(startPos, e) === false) return
      }

      setIsDragging(true)
      if (preventDefault) e.preventDefault()
      if (stopPropagation) e.stopPropagation()
    },
    [targetRef, onStart, preventDefault, stopPropagation, position]
  )

  const constrainPosition = useCallback(
    (x: number, y: number): Position => {
      let constrainedX = x
      let constrainedY = y

      // Apply custom boundaries if provided
      if (boundaries) {
        if (typeof boundaries.minX === 'number') {
          constrainedX = Math.max(constrainedX, boundaries.minX)
        }
        if (typeof boundaries.maxX === 'number') {
          constrainedX = Math.min(constrainedX, boundaries.maxX)
        }
        if (typeof boundaries.minY === 'number') {
          constrainedY = Math.max(constrainedY, boundaries.minY)
        }
        if (typeof boundaries.maxY === 'number') {
          constrainedY = Math.min(constrainedY, boundaries.maxY)
        }
      }

      // Apply container boundaries if provided
      if (containerElement) {
        const containerRect = containerElement.getBoundingClientRect()
        const target = targetRef.current
        if (target) {
          const targetRect = target.getBoundingClientRect()
          constrainedX = Math.min(
            Math.max(constrainedX, containerRect.left),
            containerRect.right - targetRect.width
          )
          constrainedY = Math.min(
            Math.max(constrainedY, containerRect.top),
            containerRect.bottom - targetRect.height
          )
        }
      }

      return { x: constrainedX, y: constrainedY }
    },
    [boundaries, containerElement, targetRef]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !dragStartRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newX = initialPositionRef.current.x + deltaX
      const newY = initialPositionRef.current.y + deltaY

      const constrainedPosition = constrainPosition(newX, newY)
      setPosition(constrainedPosition)

      if (onMove) onMove(constrainedPosition, e)

      if (preventDefault) e.preventDefault()
      if (stopPropagation) e.stopPropagation()
    },
    [isDragging, constrainPosition, onMove, preventDefault, stopPropagation]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return

      setIsDragging(false)
      dragStartRef.current = null
      if (onEnd) onEnd(position, e)

      if (preventDefault) e.preventDefault()
      if (stopPropagation) e.stopPropagation()
    },
    [isDragging, position, onEnd, preventDefault, stopPropagation]
  )

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    target.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      target.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [targetRef, handlePointerDown, handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (boundaries) {
      setPosition({ x: Number(boundaries.minX), y: Number(boundaries.minY) })
    }
  }, [])

  return { x: position.x, y: position.y, isDragging }
}
