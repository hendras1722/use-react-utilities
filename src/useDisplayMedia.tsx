import { useState, useEffect, useRef, useCallback } from 'react'

interface useDisplayMediaOptions {
  audio?: boolean
  video?: boolean | MediaTrackConstraints
}

function useDisplayMedia(options: useDisplayMediaOptions = {}) {
  const { audio = false, video = true } = options

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isSharing, setIsSharing] = useState(false) // Track if screen sharing is active
  const streamRef = useRef<MediaStream | null>(null) // Menyimpan stream di ref

  const startSharing = useCallback(async () => {
    setIsSharing(true)
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        video: video,
        audio: audio,
      })
      streamRef.current = newStream
      setStream(newStream)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      console.error('Error getting screen share:', error)
      setIsSharing(false) // Reset isSharing on error
      setStream(null)
    }
  }, [audio, video])

  const stopSharing = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
      setError(null)
    }
    setIsSharing(false)
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup stream when the component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    stream,
    error,
    startSharing,
    stopSharing,
    isSharing,
  }
}

export { useDisplayMedia }
