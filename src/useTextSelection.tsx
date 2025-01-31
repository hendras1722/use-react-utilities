import { useState, useEffect } from 'react'

function getRangesFromSelection(selection: Selection): Range[] {
  const rangeCount = selection.rangeCount ?? 0
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i))
}

interface UseTextSelectionReturn {
  text: string
  rects: DOMRect[]
  ranges: Range[]
  selection: Selection | null
}

export function useTextSelection(): UseTextSelectionReturn {
  const [text, setText] = useState('')
  const [rects, setRects] = useState<DOMRect[]>([])
  const [ranges, setRanges] = useState<Range[]>([])
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      const newSelection = window.getSelection()
      setSelection(newSelection)
      setText(newSelection?.toString() ?? '')

      if (newSelection) {
        const newRanges = getRangesFromSelection(newSelection)
        setRanges(newRanges)
        setRects(newRanges.map((range) => range.getBoundingClientRect()))
      } else {
        setRanges([])
        setRects([])
      }
    }

    // Initial selection check
    handleSelectionChange()

    // Add event listener
    document.addEventListener('selectionchange', handleSelectionChange)

    // Cleanup
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  return {
    text,
    rects,
    ranges,
    selection,
  }
}
