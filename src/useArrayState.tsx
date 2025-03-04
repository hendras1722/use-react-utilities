import { useState, useCallback } from 'react'

type ArrayStateActions<T> = {
  add: (item: T) => void
  remove: (index: number) => void
  clear: () => void
}

const useArrayState = <T,>(
  initialItems: T[] = []
): [T[], ArrayStateActions<T>] => {
  const [items, setItems] = useState<T[]>(initialItems)

  const add = useCallback(
    (item: T) => {
      setItems((prevItems) => [...prevItems, item])
    },
    [setItems]
  )

  const remove = useCallback(
    (index: number) => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        newItems.splice(index, 1)
        return newItems
      })
    },
    [setItems]
  )

  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  return [items, { add, remove, clear }]
}

export { useArrayState }
