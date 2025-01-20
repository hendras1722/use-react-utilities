import { useState, useEffect, useRef } from 'react'

interface DebounceOptions {
  maxWait?: number
  leading?: boolean
}

/**
 * Custom hook to debounce updates of a value while maintaining immediate access to current value.
 *
 * @param initialValue The initial value
 * @param delay The delay in milliseconds
 * @param options Debounce options
 * @returns [current value, debounced value, setValue function]
 */
export default function useDebounce<T>(
  initialValue: T,
  delay: number = 200,
  options: DebounceOptions = {}
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const maxWaitRef = useRef<ReturnType<typeof setTimeout>>(null)
  const lastCallTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const handleMaxWait = () => {
      if (
        options.maxWait &&
        Date.now() - lastCallTimeRef.current >= options.maxWait
      ) {
        if (maxWaitRef.current) {
          clearTimeout(maxWaitRef.current)
        }
        setDebouncedValue(value)
        lastCallTimeRef.current = Date.now()
      }
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set maxWait timeout if needed
    if (options.maxWait) {
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
      }
      maxWaitRef.current = setTimeout(handleMaxWait, options.maxWait)
    }

    // Handle leading call
    if (options.leading && lastCallTimeRef.current === 0) {
      setDebouncedValue(value)
      lastCallTimeRef.current = Date.now()
      return
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
      lastCallTimeRef.current = Date.now()
    }, delay)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
      }
    }
  }, [value, delay, options.maxWait, options.leading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current)
      }
    }
  }, [])

  return [value, debouncedValue, setValue]
}
