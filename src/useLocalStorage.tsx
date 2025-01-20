'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

const StorageSerializers: Record<
  'boolean' | 'object' | 'number' | 'any' | 'string' | 'map' | 'set' | 'date',
  Serializer<any>
> = {
  boolean: {
    read: (v: any) => v === 'true',
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => JSON.parse(v),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => Number.parseFloat(v),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => v,
    write: (v: any) => String(v),
  },
  map: {
    read: (v: any) => new Map(JSON.parse(v)),
    write: (v: any) =>
      JSON.stringify(Array.from((v as Map<any, any>).entries())),
  },
  set: {
    read: (v: any) => new Set(JSON.parse(v)),
    write: (v: any) => JSON.stringify(Array.from(v as Set<any>)),
  },
  date: {
    read: (v: any) => new Date(v),
    write: (v: any) => v.toISOString(),
  },
}

interface UseStorageOptions<T> {
  /**
   * Listen to storage changes, useful for multiple tabs application
   * @default true
   */
  listenToStorageChanges?: boolean

  /**
   * Write the default value to the storage when it does not exist
   * @default true
   */
  writeDefaults?: boolean

  /**
   * Merge the default value with the value read from the storage.
   * @default false
   */
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T)

  /**
   * Custom data serializer
   */
  serializer?: Serializer<T>

  /**
   * On error callback
   */
  onError?: (error: unknown) => void
}

function guessSerializerType<T>(value: T): keyof typeof StorageSerializers {
  if (value === null) return 'any'
  if (value instanceof Map) return 'map'
  if (value instanceof Set) return 'set'
  if (value instanceof Date) return 'date'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'object') return 'object'
  return 'any'
}

export default function useStorage<T>(
  key: string,
  defaultValue: T,
  storage: Storage = window.localStorage,
  options: UseStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    onError = (e) => console.error(e),
  } = options

  const type = guessSerializerType(defaultValue)
  const serializer = options.serializer ?? StorageSerializers[type]

  // Use state to store the current value
  const [state, setState] = useState<T>(() => {
    try {
      const rawValue = storage.getItem(key)
      if (rawValue == null) {
        if (writeDefaults && defaultValue != null) {
          storage.setItem(key, serializer.write(defaultValue))
        }
        return defaultValue
      }

      const value = serializer.read(rawValue)
      if (mergeDefaults) {
        if (typeof mergeDefaults === 'function') {
          return mergeDefaults(value, defaultValue)
        } else if (type === 'object' && !Array.isArray(value)) {
          return { ...(defaultValue as any), ...value }
        }
      }
      return value
    } catch (e) {
      onError(e)
      return defaultValue
    }
  })

  // Keep track of the current key for storage event handling
  const currentKey = useRef(key)
  useEffect(() => {
    currentKey.current = key
  }, [key])

  // Storage event handler for cross-tab synchronization
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === currentKey.current && event.storageArea === storage) {
        try {
          const newValue = event.newValue
            ? serializer.read(event.newValue)
            : defaultValue
          setState(newValue)
        } catch (e) {
          onError(e)
        }
      }
    },
    [defaultValue, storage, serializer, onError]
  )

  // Set up storage event listener
  useEffect(() => {
    if (listenToStorageChanges) {
      window.addEventListener('storage', handleStorageChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
    return undefined
  }, [listenToStorageChanges, handleStorageChange])

  // Update function that handles both direct values and updater functions
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setState((prev) => {
          const value =
            typeof newValue === 'function'
              ? (newValue as (prev: T) => T)(prev)
              : newValue

          storage.setItem(key, serializer.write(value))
          return value
        })
      } catch (e) {
        onError(e)
      }
    },
    [key, storage, serializer, onError]
  )

  // Remove function to clear the storage
  const removeItem = useCallback(() => {
    try {
      storage.removeItem(key)
      setState(defaultValue)
    } catch (e) {
      onError(e)
    }
  }, [key, storage, defaultValue, onError])

  return [state, updateValue, removeItem]
}
