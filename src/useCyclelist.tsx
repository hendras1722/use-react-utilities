import { useCallback, useState } from 'react'

export interface UseCycleListOptions<T> {
  /**
   * The initial value of the state
   */
  initialValue?: T
  /**
   * The default index when value is not found in the list
   */
  fallbackIndex?: number
  /**
   * Custom function to get the index of the current value
   */
  getIndexOf?: (value: T, list: T[]) => number
}

export interface UseCycleListReturn<T> {
  state: T
  index: number
  next: (n?: number) => T
  prev: (n?: number) => T
  /**
   * Go to a specific index
   */
  go: (i: number) => T
}

/**
 * Cycle through a list of items
 */
export function useCycleList<T>(items: T[]) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const state = items[currentIndex]

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    )
  }, [items.length])

  return { state, next, prev }
}
