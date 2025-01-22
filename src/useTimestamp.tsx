'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimestampOptions<Controls extends boolean = false> {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number
  /**
   * Update the timestamp immediately
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Update interval, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: 'requestAnimationFrame' | number
  /**
   * Callback on each update
   */
  callback?: (timestamp: number) => void
}

interface Pausable {
  pause: () => void
  resume: () => void
  isActive: boolean
}

const timestamp = () => Date.now()

function useTimestamp<Controls extends boolean = false>(
  options: UseTimestampOptions<Controls> = {}
): Controls extends true ? { timestamp: number } & Pausable : number {
  const {
    controls: exposeControls = false as Controls,
    offset = 0,
    immediate = true,
    interval = 'requestAnimationFrame',
    callback,
  } = options

  const [ts, setTs] = useState(timestamp() + offset)
  const [isActive, setIsActive] = useState(immediate)
  const rafId = useRef<number>(null)
  const intervalId = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = useCallback(() => {
    const newTs = timestamp() + offset
    setTs(newTs)
    callback?.(newTs)
  }, [offset, callback])

  const pause = useCallback(() => {
    setIsActive(false)
    if (interval === 'requestAnimationFrame') {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    } else {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [interval])

  const resume = useCallback(() => {
    setIsActive(true)
  }, [])

  useEffect(() => {
    if (!isActive) return

    if (interval === 'requestAnimationFrame') {
      const tick = () => {
        update()
        rafId.current = requestAnimationFrame(tick)
      }
      rafId.current = requestAnimationFrame(tick)

      return () => {
        if (rafId.current) cancelAnimationFrame(rafId.current)
      }
    } else {
      update() // Initial update
      intervalId.current = setInterval(update, interval)

      return () => {
        if (intervalId.current) clearInterval(intervalId.current)
      }
    }
  }, [interval, isActive, update])

  if (exposeControls) {
    return {
      timestamp: ts,
      pause,
      resume,
      isActive,
    } as Controls extends true ? { timestamp: number } & Pausable : number
  }

  return ts as Controls extends true ? { timestamp: number } & Pausable : number
}

export type UseTimestampReturn = ReturnType<typeof useTimestamp>
export default useTimestamp
