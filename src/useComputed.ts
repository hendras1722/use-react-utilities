'use client'
import { useMemo, useCallback } from 'react'

export interface Computed<T> {
  readonly value: T
}

export interface WritableComputed<T> {
  value: T
}

export function useComputed<T>(
  getter: () => T,
  setter?: (newValue: T) => void
): Computed<T> | WritableComputed<T> {
  const computedValue = useMemo(() => {
    try {
      return getter()
    } catch (error) {
      console.error('Error in computed getter:', error)
      return undefined as T
    }
  }, [getter])

  // If a setter is provided, create and return the WritableComputed object
  if (setter) {
    const setterFn = useCallback(
      (newValue: T) => {
        setter(newValue)
      },
      [setter]
    )

    return useMemo(() => ({
      get value(): T {
        return computedValue
      },
      set value(newVal: T) {
        setterFn(newVal)
      },
    }), [computedValue, setterFn])
  }

  // Otherwise, return the read-only Computed object
  return useMemo(() => ({
    get value(): T {
      return computedValue
    },
  }), [computedValue])
}
