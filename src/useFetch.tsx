import { useState, useEffect, useCallback, useRef } from 'react'

// type HttpMethod =
//   | 'GET'
//   | 'POST'
//   | 'PUT'
//   | 'DELETE'
//   | 'PATCH'
//   | 'HEAD'
//   | 'OPTIONS'
type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'

interface BeforeFetchContext {
  url: string
  options: RequestInit
  cancel: () => void
}

interface AfterFetchContext<T = any> {
  response: Response
  data: T | null
}

interface OnFetchErrorContext<T = any> {
  error: any
  data: T | null
  response: Response | null
}

export interface UseFetchOptions<T = any> {
  // Export the interface
  responseType?: ResponseType
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number
  errorRetryInterval?: number
  errorRetryCount?: number
  initialData?: T | null
  payload?: unknown
  params?: Record<string, any>
  payloadType?: string
  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void
  afterFetch?: (
    ctx: AfterFetchContext<T>
  ) => Promise<Partial<AfterFetchContext<T>>> | Partial<AfterFetchContext<T>>
  onFetchError?: (
    ctx: OnFetchErrorContext<T>
  ) =>
    | Promise<Partial<OnFetchErrorContext<T>>>
    | Partial<OnFetchErrorContext<T>>

  useCache?: boolean // New option to control cache usage
}

const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain',
}

// Simple in-memory cache
const cache = new Map<string, any>()

const fetcher = async <T,>(
  url: string,
  fetchOptions: RequestInit,
  options: UseFetchOptions<T>
): Promise<T> => {
  const {
    responseType = 'json',
    payload,
    payloadType,
    params,
    beforeFetch,
    afterFetch,
  } = options

  const defaultOptions: RequestInit = {
    ...fetchOptions, // Menggunakan fetchOptions sebagai basis
  }

  if (payload) {
    const headers = { ...defaultOptions.headers } as Record<string, string>
    let finalPayloadType = payloadType

    if (
      !finalPayloadType &&
      (Object.getPrototypeOf(payload) === Object.prototype ||
        Array.isArray(payload)) &&
      !(payload instanceof FormData)
    ) {
      finalPayloadType = 'json'
    }

    if (finalPayloadType) {
      headers['Content-Type'] = payloadMapping[finalPayloadType] ?? payloadType
      defaultOptions.headers = headers
    }

    defaultOptions.body =
      finalPayloadType === 'json'
        ? JSON.stringify(payload)
        : (payload as BodyInit)
  }

  let isCanceled = false

  const context: BeforeFetchContext = {
    url,
    options: {
      ...defaultOptions,
      ...fetchOptions,
    },
    cancel: () => {
      isCanceled = true
    },
  }

  console.log('context', context)

  try {
    if (beforeFetch) {
      Object.assign(context, await beforeFetch(context))
    }

    if (isCanceled) {
      throw new Error('Request cancelled')
    }

    const finalUrl = params ? url + '?' + new URLSearchParams(params) : url
    const fetchResponse = await fetch(finalUrl, context.options)

    if (!fetchResponse.ok) {
      throw new Error(fetchResponse.statusText)
    }

    const responseData = await fetchResponse.clone()[responseType]()

    if (afterFetch) {
      const result = await afterFetch({
        data: responseData,
        response: fetchResponse,
      })
      return (result.data ?? responseData) as T
    }

    return responseData as T
  } catch (error) {
    throw error
  }
}

export default function useFetch<T = any>(
  url: string | null, // Allow null url
  fetchOptions: RequestInit = {},
  options: UseFetchOptions<T> = {}
): {
  data: T | undefined
  error: any
  isLoading: boolean
  mutate: () => void
} {
  const {
    initialData,
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    dedupingInterval = 2000,
    errorRetryInterval = 5000,
    errorRetryCount = 3,
    onFetchError,
    useCache = true,
  } = options

  // Atur manual ke true jika method adalah POST, PUT, PATCH, atau DELETE
  const method = fetchOptions.method || 'GET'
  const manual = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    method.toUpperCase()
  )

  // Determine initial data (cache or initialData)
  const cachedData = url && useCache ? cache.get(url) : undefined
  const [data, setData] = useState<T | undefined>(cachedData || initialData)

  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasFetchedRef = useRef(false)
  const lastFetchedTimeRef = useRef<number | null>(null)
  const retryCountRef = useRef(0)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isClient = typeof window !== 'undefined' // Check if we're on the client-side

  const fetchData = useCallback(async () => {
    if (!url) {
      return
    }

    setIsLoading(true)
    try {
      const fetchedData = await fetcher<T>(url, fetchOptions, options)
      setData(fetchedData)
      if (useCache) {
        cache.set(url, fetchedData)
      }
      retryCountRef.current = 0
      lastFetchedTimeRef.current = Date.now()
      console.log('fetchData: Successful fetch, resetting retryCount to 0')
    } catch (err: any) {
      setError(err)
      console.error('fetchData: Fetch error:', err)
      if (onFetchError) {
        await onFetchError({ data: null, error: err, response: null })
      }

      if (retryCountRef.current < errorRetryCount) {
        retryCountRef.current++
        console.log(
          `fetchData: Retrying fetch, attempt ${retryCountRef.current}/${errorRetryCount}`
        )
        timeoutIdRef.current = setTimeout(() => {
          fetchData()
        }, errorRetryInterval)
      } else {
        console.log('fetchData: Max retries reached, not retrying further')
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    url,
    fetchOptions,
    options,
    onFetchError,
    useCache,
    errorRetryCount,
    errorRetryInterval,
  ])

  const mutate = useCallback(() => {
    if (url) {
      cache.delete(url)
    }
    hasFetchedRef.current = false
    fetchData() // Panggil fetchData di dalam mutate
  }, [url, fetchData])

  //Revalidation
  const revalidate = useCallback(() => {
    if (url) {
      fetchData()
    }
  }, [url, fetchData])

  useEffect(() => {
    // Only run on client-side
    if (isClient && url && !hasFetchedRef.current && !manual) {
      // Periksa opsi manual
      hasFetchedRef.current = true
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isClient, manual])

  //Revalidate on Focus
  useEffect(() => {
    if (!revalidateOnFocus || !isClient) return

    const handleFocus = () => {
      if (!url) return
      if (
        lastFetchedTimeRef.current === null ||
        Date.now() - (lastFetchedTimeRef.current || 0) >= dedupingInterval
      ) {
        revalidate()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [url, revalidateOnFocus, dedupingInterval, revalidate, isClient])

  //Revalidate on Reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || !isClient) return

    const handleReconnect = () => {
      if (!url) return
      revalidate()
    }

    window.addEventListener('online', handleReconnect)
    return () => window.removeEventListener('focus', handleReconnect)
  }, [url, revalidateOnReconnect, revalidate, isClient])

  //Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        console.log('useEffect cleanup: Clearing timeout')
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [])

  return { data, error, isLoading, mutate }
}
