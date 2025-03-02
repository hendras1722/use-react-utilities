import { useState, useEffect, useCallback, useRef } from 'react'

interface UseDisplayMediaOptions {
  enabled?: boolean
  video?: boolean | MediaTrackConstraints | undefined
  audio?: boolean | MediaTrackConstraints | undefined
  navigator?: Navigator
}

export function useDisplayMedia(options: UseDisplayMediaOptions = {}) {
  const {
    enabled: initialEnabled = false,
    video = true,
    audio = false,
    navigator = typeof window !== 'undefined' ? window.navigator : undefined,
  } = options

  const [enabled, setEnabled] = useState(initialEnabled)
  const [stream, setStream] = useState<MediaStream | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const streamRef = useRef<MediaStream | undefined>(undefined)

  const isSupported = navigator?.mediaDevices?.getDisplayMedia !== undefined

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = undefined
      setStream(undefined)
    }
  }, [])

  const stop = useCallback(() => {
    stopStream()
    setEnabled(false)
  }, [stopStream])
  const [isStarting, setIsStarting] = useState(false) // Tambahkan state

  const start = useCallback(async () => {
    if (!isSupported || isStarting) return undefined // Cek isStarting

    setIsStarting(true) // Set isStarting ke true sebelum getDisplayMedia

    setError(null)

    if (streamRef.current) {
      stopStream()
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: typeof video === 'boolean' ? video : { ...video },
        audio: typeof audio === 'boolean' ? audio : { ...audio },
      }

      console.log('Constraints:', constraints) // Debugging

      const newStream = await navigator!.mediaDevices.getDisplayMedia(
        constraints
      )

      newStream.getTracks().forEach((track) => {
        track.addEventListener(
          'ended',
          () => {
            stop()
          },
          { passive: true }
        )
      })

      streamRef.current = newStream
      setStream(newStream)
      setEnabled(true)
      return newStream
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('Error getting display media:', error)
      setError(error)
      setEnabled(false)

      if (error.name === 'NotAllowedError') {
        console.warn('Screen sharing permission denied by user.')
        // Consider displaying a user-friendly message to guide the user to enable permissions
      } else if (error.name === 'NotFoundError') {
        console.warn(
          'No screen sharing source found (e.g., no screens available).'
        )
        // Consider displaying a message to the user
      } else {
        console.error(
          'An unexpected error occurred during screen sharing:',
          error
        )
        // Handle other potential errors
      }
      return undefined
    } finally {
      setIsStarting(false) // Reset isStarting di finally
    }
  }, [isSupported, navigator, video, audio, stop, stopStream, isStarting]) // Tambahkan isStarting ke dependensi

  useEffect(() => {
    if (enabled && !streamRef.current) {
      if (initialEnabled === false) {
        // Only start if manually triggered.
        console.log(
          'Attempting to start screen sharing programmatically (likely wrong).  Should be user-triggered.'
        )
      }
    } else if (!enabled && streamRef.current) {
      stopStream()
    }

    return () => {
      stopStream()
    }
  }, [enabled, initialEnabled, start, stopStream])

  return {
    isSupported,
    stream,
    error,
    start,
    stop,
    enabled,
    setEnabled,
  }
}

export type UseDisplayMediaReturn = ReturnType<typeof useDisplayMedia>
