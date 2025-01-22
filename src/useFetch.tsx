import { useState, useEffect, useCallback, useRef } from 'react'

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
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

interface UseFetchOptions<T = any> {
  responseType?: ResponseType
  method?: HttpMethod
  immediate?: boolean
  timeout?: number
  updateDataOnError?: boolean
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
}

const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain',
}

export default function useFetch<T = any>(
  url: string,
  fetchOptions: RequestInit = {},
  options: UseFetchOptions<T> = {}
): {
  isFinished: boolean
  isFetching: boolean
  statusCode: number | null
  response: Response | null
  error: any
  data: T | null
  canAbort: boolean
  aborted: boolean
  abort: () => void
  execute: (throwOnFailed?: boolean) => Promise<Response | null>
  refetch: () => Promise<Response | null>
} {
  const {
    responseType = 'json',
    method = 'GET',
    immediate = false,
    timeout = 0,
    updateDataOnError = false,
    initialData = null,
    payload,
    payloadType,
  } = options

  const [isFinished, setIsFinished] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [response, setResponse] = useState<Response | null>(null)
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<T | null>(initialData)
  const [aborted, setAborted] = useState(false)

  const abortController = useRef<AbortController | null>(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)
  const initialFetchRef = useRef(false)

  const canAbort = typeof AbortController === 'function' && isFetching

  const cleanup = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      timeoutId.current = null
    }
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
  }, [])

  const abort = useCallback(() => {
    if (typeof AbortController === 'function') {
      cleanup()
      abortController.current = new AbortController()
      setAborted(true)
    }
  }, [cleanup])

  const createFetchOptions = useCallback(() => {
    const defaultOptions: RequestInit = {
      method,
      headers: { ...fetchOptions.headers },
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
        headers['Content-Type'] =
          payloadMapping[finalPayloadType] ?? finalPayloadType
        defaultOptions.headers = headers
      }

      defaultOptions.body =
        finalPayloadType === 'json'
          ? JSON.stringify(payload)
          : (payload as BodyInit)
    }

    return defaultOptions
  }, [method, fetchOptions.headers, payload, payloadType])

  const execute = useCallback(
    async (throwOnFailed = false) => {
      if (isFetching || !mountedRef.current) return null

      // Only set fetching state if we're really going to execute
      setIsFetching(true)
      setIsFinished(false)
      setError(null)
      setStatusCode(null)
      setAborted(false)

      const defaultOptions = createFetchOptions()
      let isCanceled = false

      const context: BeforeFetchContext = {
        url,
        options: {
          ...defaultOptions,
          ...fetchOptions,
          signal: abortController.current?.signal,
        },
        cancel: () => {
          isCanceled = true
        },
      }

      try {
        if (options.beforeFetch) {
          Object.assign(context, await options.beforeFetch(context))
        }

        if (isCanceled || !mountedRef.current) {
          setIsFetching(false)
          return null
        }

        if (timeout) {
          timeoutId.current = setTimeout(abort, timeout)
        }
        const params = options.params
          ? '?' + new URLSearchParams(options.params)
          : ''
        const fetchResponse = await fetch(context.url + params, {
          ...context.options,
          headers: {
            ...defaultOptions.headers,
            ...context.options?.headers,
          },
        })

        if (!mountedRef.current) return null

        setResponse(fetchResponse)
        setStatusCode(fetchResponse.status)

        const responseData = await fetchResponse.clone()[responseType]()

        if (!fetchResponse.ok) {
          setData(initialData)
          throw new Error(fetchResponse.statusText)
        }

        if (options.afterFetch && mountedRef.current) {
          const result = await options.afterFetch({
            data: responseData,
            response: fetchResponse,
          })
          const finalData = result.data ?? responseData
          setData(finalData)
        } else if (mountedRef.current) {
          setData(responseData)
        }

        return fetchResponse
      } catch (fetchError: any) {
        if (!mountedRef.current) return null

        let errorData = fetchError.message || fetchError.name
        let responseData = null as T | null

        if (options.onFetchError) {
          const result = await options.onFetchError({
            data: null,
            error: fetchError,
            response,
          })
          errorData = result.error ?? errorData
          responseData = result.data ?? null
        }

        if (mountedRef.current) {
          setError(errorData)
          if (updateDataOnError && responseData) {
            setData(responseData)
          }
        }

        if (throwOnFailed) {
          throw fetchError
        }
        return null
      } finally {
        if (mountedRef.current) {
          setIsFetching(false)
          setIsFinished(true)
        }
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }
      }
    },
    [
      url,
      fetchOptions,
      options,
      abort,
      createFetchOptions,
      responseType,
      initialData,
      timeout,
      updateDataOnError,
      isFetching,
    ]
  )

  const refetch = useCallback(() => execute(), [execute])

  useEffect(() => {
    mountedRef.current = true

    if (immediate && !initialFetchRef.current) {
      initialFetchRef.current = true
      execute()
    }

    return () => {
      mountedRef.current = false
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [immediate, execute])

  return {
    isFinished,
    isFetching,
    statusCode,
    response,
    error,
    data,
    canAbort,
    aborted,
    abort,
    execute,
    refetch,
  }
}
