'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.useArrayState = void 0
const react_1 = require('react')
const useArrayState = (initialItems = []) => {
  const [items, setItems] = (0, react_1.useState)(initialItems)
  const add = (0, react_1.useCallback)(
    (item) => {
      setItems((prevItems) => [...prevItems, item])
    },
    [setItems]
  )
  const replace = (0, react_1.useCallback)(
    (index, item) => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        newItems[index] = item
        return newItems
      })
    },
    [setItems]
  )
  const remove = (0, react_1.useCallback)(
    (index) => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        newItems.splice(index, 1)
        return newItems
      })
    },
    [setItems]
  )
  const clear = (0, react_1.useCallback)(() => {
    setItems([])
  }, [setItems])
  return [items, { add, remove, clear, replace }]
}
exports.useArrayState = useArrayState
exports.default = exports.useArrayState
