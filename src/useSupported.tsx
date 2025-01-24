import { useState, useEffect } from 'react'

export default function useSupported(callback: () => unknown) {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check support when component mounts
    setIsSupported(Boolean(callback()))
  }, [callback])

  return isSupported
}
