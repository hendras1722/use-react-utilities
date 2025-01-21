import { useState, useCallback, useEffect, useMemo } from 'react'

interface UseClipboardOptions {
  /**
   * Enable reading from clipboard
   * @default false
   */
  read?: boolean
  /**
   * Default text to copy
   */
  source?: string
  /**
   * Duration in ms before resetting copied state
   * @default 1500
   */
  copiedDuring?: number
  /**
   * Whether to use legacy clipboard API as fallback
   * @default false
   */
  legacy?: boolean
}

interface UseClipboardReturn {
  isSupported: boolean
  text: string
  copied: boolean
  copy: (text?: string) => Promise<void>
}

/**
 * React hook for clipboard operations
 */
const useClipboard = (
  options: UseClipboardOptions = {}
): UseClipboardReturn => {
  const { read = false, source, copiedDuring = 1500, legacy = false } = options

  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  // Check if clipboard API is supported
  const isSupported = useMemo(() => {
    return (
      typeof navigator !== 'undefined' && ('clipboard' in navigator || legacy)
    )
  }, [legacy])

  // Legacy copy function
  const legacyCopy = useCallback((value: string) => {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }, [])

  // Legacy read function
  const legacyRead = useCallback((): string => {
    return document?.getSelection?.()?.toString() ?? ''
  }, [])

  // Copy function
  const copy = useCallback(
    async (value: string = source ?? '') => {
      if (isSupported && value != null) {
        try {
          if ('clipboard' in navigator) {
            await navigator.clipboard.writeText(value)
          } else if (legacy) {
            legacyCopy(value)
          }
          setText(value)
          setCopied(true)

          // Reset copied state after delay
          setTimeout(() => {
            setCopied(false)
          }, copiedDuring)
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      }
    },
    [isSupported, source, copiedDuring, legacy, legacyCopy]
  )

  // Handle clipboard read events
  useEffect(() => {
    if (!isSupported || !read) return

    const updateText = async () => {
      try {
        if ('clipboard' in navigator) {
          const value = await navigator.clipboard.readText()
          setText(value)
        } else {
          setText(legacyRead())
        }
      } catch (err) {
        console.error('Failed to read clipboard:', err)
      }
    }

    const events = ['copy', 'cut']
    events.forEach((event) => {
      document.addEventListener(event, updateText, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateText)
      })
    }
  }, [isSupported, read, legacyRead])

  return {
    isSupported,
    text,
    copied,
    copy,
  }
}

export default useClipboard
