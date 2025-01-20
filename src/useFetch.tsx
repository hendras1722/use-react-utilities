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

export interface UseFetchOptions<T = any> {
  /**
   * Response data type
   * @default 'json'
   */
  responseType?: ResponseType

  /**
   * HTTP method
   * @default 'GET'
   */
  method?: HttpMethod

  /**
   * Request payload for POST, PUT, PATCH methods
   */
  payload?: unknown

  /**
   * Content-Type header for the payload
   * @default 'application/json' for object/array payloads
   */
  payloadType?: string

  /**
   * Will automatically run fetch when component mounts
   * @default true
   */
  immediate?: boolean

  /**
   * Initial data before the request finished
   * @default null
   */
  initialData?: T | null

  /**
   * Timeout for abort request after number of milliseconds
   * `0` means use browser default
   * @default 0
   */
  timeout?: number

  /**
   * Allow updating the data when fetch errors
   * @default false
   */
  updateDataOnError?: boolean

  /**
   * Will run immediately before the fetch request is dispatched
   */
  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void

  /**
   * Will run immediately after the fetch request is returned.
   * Runs after any 2xx response
   */
  afterFetch?: (
    ctx: AfterFetchContext<T>
  ) => Promise<Partial<AfterFetchContext<T>>> | Partial<AfterFetchContext<T>>

  /**
   * Will run immediately after the fetch request is returned.
   * Runs after any 4xx and 5xx response
   */
  onFetchError?: (
    ctx: OnFetchErrorContext<T>
  ) =>
    | Promise<Partial<OnFetchErrorContext<T>>>
    | Partial<OnFetchErrorContext<T>>
}

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

interface UseFetchReturn<T> {
  /**
   * Indicates if the fetch request has finished
   */
  isFinished: boolean

  /**
   * Indicates if the request is currently being fetched
   */
  isFetching: boolean

  /**
   * The statusCode of the HTTP fetch response
   */
  statusCode: number | null

  /**
   * The raw response of the fetch response
   */
  response: Response | null

  /**
   * Any fetch errors that may have occurred
   */
  error: any

  /**
   * The fetch response body on success
   */
  data: T | null

  /**
   * Indicates if the fetch request is able to be aborted
   */
  canAbort: boolean

  /**
   * Indicates if the fetch request was aborted
   */
  aborted: boolean

  /**
   * Abort the fetch request
   */
  abort: () => void

  /**
   * Manually call the fetch
   * @param throwOnFailed Whether to throw an error on failed requests
   */
  execute: (throwOnFailed?: boolean) => Promise<Response | null>

  /**
   * Refetch the data using current options
   */
  refetch: () => Promise<Response | null>
}

const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain',
}

export default function useFetch<T = any>(
  url: string,
  fetchOptions: RequestInit = {},
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const {
    responseType = 'json',
    method = 'GET',
    immediate = true,
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
  const hasFetched = useRef(false)

  const abortController = useRef<AbortController | null>(null)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const executeCounter = useRef(0)

  const canAbort = typeof AbortController === 'function' && isFetching

  const abort = useCallback(() => {
    if (typeof AbortController === 'function') {
      abortController.current?.abort()
      abortController.current = new AbortController()
      setAborted(true)
    }
  }, [])

  const execute = useCallback(
    async (throwOnFailed = false) => {
      abort()

      setIsFetching(true)
      setIsFinished(false)
      setError(null)
      setStatusCode(null)
      setAborted(false)

      executeCounter.current += 1
      const currentExecuteCounter = executeCounter.current

      const defaultFetchOptions: RequestInit = {
        method,
        headers: {},
      }

      if (payload) {
        const headers = { ...defaultFetchOptions.headers } as Record<
          string,
          string
        >

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
        }

        defaultFetchOptions.body =
          finalPayloadType === 'json'
            ? JSON.stringify(payload)
            : (payload as BodyInit)
      }

      let isCanceled = false
      const context: BeforeFetchContext = {
        url,
        options: {
          ...defaultFetchOptions,
          ...fetchOptions,
          signal: abortController.current?.signal,
        },
        cancel: () => {
          isCanceled = true
        },
      }

      if (options.beforeFetch) {
        Object.assign(context, await options.beforeFetch(context))
      }

      if (isCanceled) {
        setIsFetching(false)
        return null
      }

      if (timeout) {
        timeoutId.current = setTimeout(abort, timeout)
      }

      let responseData: any = null

      try {
        const fetchResponse = await fetch(context.url, {
          ...context.options,
          headers: {
            ...defaultFetchOptions.headers,
            ...context.options?.headers,
          },
        })

        setResponse(fetchResponse)
        setStatusCode(fetchResponse.status)

        responseData = await fetchResponse.clone()[responseType]()

        if (!fetchResponse.ok) {
          setData(initialData)
          throw new Error(fetchResponse.statusText)
        }

        if (options.afterFetch) {
          const result = await options.afterFetch({
            data: responseData,
            response: fetchResponse,
          })
          responseData = result.data ?? responseData
        }

        setData(responseData)
        return fetchResponse
      } catch (fetchError: any) {
        let errorData = fetchError.message || fetchError.name

        if (options.onFetchError) {
          const result = await options.onFetchError({
            data: responseData,
            error: fetchError,
            response: response,
          })
          errorData = result.error ?? errorData
          responseData = result.data ?? responseData
        }

        setError(errorData)
        if (updateDataOnError) {
          setData(responseData)
        }

        if (throwOnFailed) {
          throw fetchError
        }
        return null
      } finally {
        if (currentExecuteCounter === executeCounter.current) {
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
      method,
      payload,
      payloadType,
      responseType,
      initialData,
      timeout,
      updateDataOnError,
    ]
  )

  const refetch = useCallback(() => execute(), [execute])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  useEffect(() => {
    if (!immediate && !hasFetched.current) {
      hasFetched.current = true
      execute()
    }
  }, [])

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
