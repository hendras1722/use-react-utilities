import { useState, useEffect } from 'react'
interface UseDocumentVisibilityOptions {
  document?: Document
}
export function useDocumentVisibility(
  options: UseDocumentVisibilityOptions = {}
) {
  const document = options.document ?? window.document

  // If no document is available, return 'visible' as default state
  if (!document) {
    return 'visible'
  }

  const [visibility, setVisibility] = useState(
    document ? document.visibilityState : 'visible'
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      setVisibility(document.visibilityState)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, {
      passive: true,
    })

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [document])

  return visibility
}
