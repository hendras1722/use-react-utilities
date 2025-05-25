import { useCallback, useEffect, useRef, useState, useMemo } from 'react'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UseFetchReturn<T> {
  isFinished: boolean
  statusCode: number | null
  response: Response | null
  error: any
  data: T | null
  isFetching: boolean
  canAbort: boolean
  aborted: boolean
  abort: () => void
  execute: (throwOnFailed?: boolean) => Promise<any>
  onFetchResponse: (callback: (response: Response) => void) => () => void
  onFetchError: (callback: (error: any) => void) => () => void
  onFetchFinally: (callback: () => void) => () => void

  // Methods (Chained API)
  get: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  post: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  put: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  delete: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  patch: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  head: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>
  options: <U>(
    payload?: any,
    type?: string
  ) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>

  // Type Converters (Chained API)
  json: <JSON>() => UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>
  text: () => UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>
  blob: () => UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>
  arrayBuffer: () => UseFetchReturn<ArrayBuffer> &
    PromiseLike<UseFetchReturn<ArrayBuffer>>
  formData: () => UseFetchReturn<FormData> &
    PromiseLike<UseFetchReturn<FormData>>
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'
type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
type Combination = 'overwrite' | 'chain'

export interface BeforeFetchContext {
  url: string
  options: RequestInit
  cancel: () => void
}

export interface AfterFetchContext<T = any> {
  response: Response
  data: T | null
  context: BeforeFetchContext
  execute: (throwOnFailed?: boolean) => Promise<any>
}

export interface OnFetchErrorContext<T = any, E = any> {
  error: E
  data: T | null
  response: Response | null
  context: BeforeFetchContext
  execute: (throwOnFailed?: boolean) => Promise<any>
}

export interface UseFetchOptions {
  fetch?: typeof window.fetch
  immediate?: boolean
  refetch?: boolean
  initialData?: any
  timeout?: number
  updateDataOnError?: boolean
  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void
  afterFetch?: (
    ctx: AfterFetchContext
  ) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
  onFetchError?: (
    ctx: OnFetchErrorContext
  ) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>
}

export interface CreateFetchOptions {
  baseUrl?: string
  combination?: Combination
  options?: UseFetchOptions
  fetchOptions?: RequestInit
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

const payloadMapping: Record<string, string> = {
  json: 'application/json',
  text: 'text/plain',
}

function isFetchOptions(obj: any): obj is UseFetchOptions {
  return (
    obj &&
    typeof obj === 'object' &&
    ('immediate' in obj ||
      'refetch' in obj ||
      'initialData' in obj ||
      'timeout' in obj ||
      'beforeFetch' in obj ||
      'afterFetch' in obj ||
      'onFetchError' in obj ||
      'fetch' in obj ||
      'updateDataOnError' in obj)
  )
}

const reAbsolute = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i
function isAbsoluteURL(url: string) {
  return reAbsolute.test(url)
}

function headersToObject(headers: HeadersInit | undefined) {
  if (headers instanceof Headers) {
    const headersObject: { [key: string]: string } = {}
    headers.forEach((value, key) => {
      headersObject[key] = value
    })
    return headersObject
  }
  return headers
}

function combineCallbacks<T = any>(
  combination: Combination,
  ...callbacks: (
    | ((ctx: T) => void | Partial<T> | Promise<void | Partial<T>>)
    | undefined
  )[]
) {
  if (combination === 'overwrite') {
    return async (ctx: T) => {
      let callback
      for (let i = callbacks.length - 1; i >= 0; i--) {
        if (callbacks[i] != null) {
          callback = callbacks[i]
          break
        }
      }
      if (callback) {
        return { ...ctx, ...(await callback(ctx)) }
      }
      return ctx
    }
  } else {
    return async (ctx: T) => {
      for (const callback of callbacks) {
        if (callback) {
          ctx = { ...ctx, ...(await callback(ctx)) }
        }
      }
      return ctx
    }
  }
}

function joinPaths(start: string, end: string): string {
  if (!start.endsWith('/') && !end.startsWith('/')) {
    return `${start}/${end}`
  }

  if (start.endsWith('/') && end.startsWith('/')) {
    return `${start.slice(0, -1)}${end}`
  }

  return `${start}${end}`
}

// -----------------------------------------------------------------------------
// Event Hook
// -----------------------------------------------------------------------------

class EventHook<T = any> {
  private listeners: Set<(data: T) => void> = new Set()

  on = (callback: (data: T) => void) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  trigger = (data: T) => {
    this.listeners.forEach((listener) => listener(data))
  }
}

// -----------------------------------------------------------------------------
// createFetch Factory
// -----------------------------------------------------------------------------

export function createFetch(config: CreateFetchOptions = {}) {
  const combination = config.combination || 'chain'
  const defaultOptions = config.options || {}
  const defaultFetchOptions = config.fetchOptions || {}

  return function useFactoryFetch<T>(
    url: string,
    ...args: any[]
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
    const computedUrl = useMemo(() => {
      return config.baseUrl && !isAbsoluteURL(url)
        ? joinPaths(config.baseUrl, url)
        : url
    }, [config.baseUrl, url])

    const mergedOptions = useMemo(() => {
      let currentUseFetchOptions = { ...defaultOptions }
      let currentRequestInit = { ...defaultFetchOptions }

      if (args.length > 0) {
        if (isFetchOptions(args[0])) {
          currentUseFetchOptions = {
            ...currentUseFetchOptions,
            ...args[0],
            beforeFetch: combineCallbacks(
              combination,
              defaultOptions.beforeFetch,
              args[0].beforeFetch
            ),
            afterFetch: combineCallbacks(
              combination,
              defaultOptions.afterFetch,
              args[0].afterFetch
            ),
            onFetchError: combineCallbacks(
              combination,
              defaultOptions.onFetchError,
              args[0].onFetchError
            ),
          }
        } else {
          currentRequestInit = {
            ...currentRequestInit,
            ...args[0],
            headers: {
              ...(headersToObject(currentRequestInit.headers) || {}),
              ...(headersToObject(args[0].headers) || {}),
            },
          }
        }
      }

      if (args.length > 1 && isFetchOptions(args[1])) {
        currentUseFetchOptions = {
          ...currentUseFetchOptions,
          ...args[1],
          beforeFetch: combineCallbacks(
            combination,
            defaultOptions.beforeFetch,
            args[1].beforeFetch
          ),
          afterFetch: combineCallbacks(
            combination,
            defaultOptions.afterFetch,
            args[1].afterFetch
          ),
          onFetchError: combineCallbacks(
            combination,
            defaultOptions.onFetchError,
            args[1].onFetchError
          ),
        }
      }
      return {
        options: currentUseFetchOptions,
        fetchOptions: currentRequestInit,
      }
    }, [JSON.stringify(args), defaultOptions, defaultFetchOptions, combination])

    return useFetch(
      computedUrl,
      mergedOptions.fetchOptions,
      mergedOptions.options
    )
  }
}

// -----------------------------------------------------------------------------
// useFetch Hook
// -----------------------------------------------------------------------------

export function useFetch<T>(
  url: string
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
export function useFetch<T>(
  url: string,
  useFetchOptions: UseFetchOptions
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
export function useFetch<T>(
  url: string,
  options: RequestInit,
  useFetchOptions?: UseFetchOptions
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>

export function useFetch<T>(
  url: string,
  ...args: any[]
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  const supportsAbort = typeof AbortController === 'function'

  // -------------------------------------------------------------------------
  // Argument Parsing & Option Merging
  // -------------------------------------------------------------------------

  let parsedRequestInit: RequestInit = {}
  let parsedUseFetchOptions: UseFetchOptions = {}

  if (args.length === 1) {
    if (isFetchOptions(args[0])) {
      parsedUseFetchOptions = args[0]
    } else {
      parsedRequestInit = args[0]
    }
  } else if (args.length === 2) {
    parsedRequestInit = args[0] as RequestInit
    if (isFetchOptions(args[1])) {
      parsedUseFetchOptions = args[1]
    }
  }

  const options = useMemo(
    () => ({
      immediate: true,
      refetch: false,
      timeout: 0,
      updateDataOnError: false,
      ...parsedUseFetchOptions,
    }),
    [parsedUseFetchOptions]
  )

  const fetchOptions = useMemo(() => parsedRequestInit, [parsedRequestInit])

  // -------------------------------------------------------------------------
  // Options & Callbacks
  // -------------------------------------------------------------------------

  const {
    fetch: customFetch = typeof window !== 'undefined'
      ? window.fetch
      : undefined,
    initialData,
    timeout,
    beforeFetch,
    afterFetch,
    onFetchError: onFetchErrorCallback,
    updateDataOnError,
  } = options

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [isFinished, setIsFinished] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [aborted, setAborted] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [response, setResponse] = useState<Response | null>(null)
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<T | null>(initialData || null)

  // -------------------------------------------------------------------------
  // Ref Management
  // -------------------------------------------------------------------------

  const controllerRef = useRef<AbortController | undefined>(undefined)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const executeCounterRef = useRef(0)
  const hasExecutedRef = useRef(false)
  const previousUrlRef = useRef(url)

  // Config Ref
  const configRef = useRef({
    method: 'GET' as HttpMethod,
    type: 'text' as DataType,
    payload: undefined as unknown,
    payloadType: undefined as string | undefined,
  })

  // -------------------------------------------------------------------------
  // Event Hooks
  // -------------------------------------------------------------------------

  const responseEventRef = useRef(new EventHook<Response>())
  const errorEventRef = useRef(new EventHook<any>())
  const finallyEventRef = useRef(new EventHook<any>())

  // -------------------------------------------------------------------------
  // Computed Values
  // -------------------------------------------------------------------------

  const canAbort = useMemo(
    () => supportsAbort && isFetching,
    [supportsAbort, isFetching]
  )

  // -------------------------------------------------------------------------
  // Callback Definitions
  // -------------------------------------------------------------------------

  const abort = useCallback(() => {
    if (supportsAbort && controllerRef.current) {
      controllerRef.current.abort()
    }
  }, [supportsAbort])

  const loading = useCallback((isLoading: boolean) => {
    setIsFetching(isLoading)
    setIsFinished(!isLoading)
  }, [])

  const execute = useCallback(
    async (throwOnFailed = false) => {
      if (isFetching) {
        return Promise.resolve(null)
      }

      if (supportsAbort) {
        controllerRef.current = new AbortController()
        controllerRef.current.signal.onabort = () => setAborted(true)
      }

      loading(true)
      setError(null)
      setStatusCode(null)
      setAborted(false)
      setResponse(null)
      if (!initialData) setData(null)

      executeCounterRef.current += 1
      const currentExecuteCounter = executeCounterRef.current

      const currentFetchOptions: RequestInit = {
        method: configRef.current.method,
        headers: {},
        ...fetchOptions,
      }

      const payload = configRef.current.payload
      if (payload !== undefined) {
        const headers = headersToObject(currentFetchOptions.headers) as Record<
          string,
          string
        >
        if (
          !configRef.current.payloadType &&
          payload &&
          (Object.prototype.toString.call(payload) === '[object Object]' ||
            Array.isArray(payload)) &&
          !(payload instanceof FormData)
        ) {
          configRef.current.payloadType = 'json'
        }

        if (configRef.current.payloadType) {
          headers['Content-Type'] =
            payloadMapping[configRef.current.payloadType] ??
            configRef.current.payloadType
        }

        currentFetchOptions.body =
          configRef.current.payloadType === 'json'
            ? JSON.stringify(payload)
            : (payload as BodyInit)
        currentFetchOptions.headers = headers
      }

      let isCanceled = false
      const beforeFetchCtx: BeforeFetchContext = {
        url,
        options: { ...currentFetchOptions },
        cancel: () => {
          isCanceled = true
        },
      }

      if (beforeFetch) {
        const modifiedCtx = await beforeFetch(beforeFetchCtx)
        if (modifiedCtx) {
          if (modifiedCtx.url) beforeFetchCtx.url = modifiedCtx.url
          if (modifiedCtx.options)
            beforeFetchCtx.options = {
              ...currentFetchOptions,
              ...modifiedCtx.options,
            }
        }
      }

      if (isCanceled || !customFetch) {
        loading(false)
        return Promise.resolve(null)
      }

      let responseData: any = null

      if (timerRef.current) clearTimeout(timerRef.current)
      if (timeout && timeout > 0) {
        timerRef.current = setTimeout(() => {
          if (controllerRef.current) controllerRef.current.abort()
        }, timeout)
      }

      try {
        const res = await customFetch(beforeFetchCtx.url, {
          ...beforeFetchCtx.options,
          signal: controllerRef.current?.signal,
        })

        setResponse(res)
        setStatusCode(res.status)

        if (res.ok || updateDataOnError) {
          try {
            const contentType = res.headers.get('content-type')
            if (
              configRef.current.type === 'json' ||
              (contentType && contentType.includes('application/json'))
            ) {
              responseData = await res.clone().json()
            } else {
              responseData = await res.clone()[configRef.current.type]()
            }
          } catch (parseError) {
            if (res.ok) {
              console.warn(
                `Failed to parse response as ${configRef.current.type}`,
                parseError
              )
            }
          }
        }

        if (!res.ok) {
          if (!initialData && !updateDataOnError) setData(null)
          const errorPayload =
            responseData ||
            res.statusText ||
            `HTTP error! status: ${res.status}`
          throw new Error(
            typeof errorPayload === 'string'
              ? errorPayload
              : JSON.stringify(errorPayload)
          )
        }

        if (afterFetch) {
          const modifiedAfterCtx = await afterFetch({
            data: responseData,
            response: res,
            context: beforeFetchCtx,
            execute: (throwFailure?: boolean) => execute(throwFailure),
          })
          if (modifiedAfterCtx && modifiedAfterCtx.data !== undefined) {
            responseData = modifiedAfterCtx.data
          }
        }
        setData(responseData)
        responseEventRef.current.trigger(res)
        return res
      } catch (fetchErr: any) {
        let errorData = fetchErr.message || fetchErr.name || 'Fetch Error'
        if (onFetchErrorCallback) {
          const modifiedErrorCtx = await onFetchErrorCallback({
            data: responseData,
            error: fetchErr,
            response: response,
            context: beforeFetchCtx,
            execute: (throwFailure?: boolean) => execute(throwFailure),
          })
          if (modifiedErrorCtx) {
            if (modifiedErrorCtx.error !== undefined)
              errorData = modifiedErrorCtx.error
            if (modifiedErrorCtx.data !== undefined)
              responseData = modifiedErrorCtx.data
          }
        }

        setError(errorData)
        if (updateDataOnError) {
          setData(responseData)
        } else if (!initialData) {
          setData(null)
        }

        errorEventRef.current.trigger(fetchErr)
        if (throwOnFailed) {
          throw fetchErr
        }
        return null
      } finally {
        if (currentExecuteCounter === executeCounterRef.current) {
          loading(false)
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        finallyEventRef.current.trigger(null)
        hasExecutedRef.current = true
      }
    },
    [
      url,
      JSON.stringify(fetchOptions),
      initialData,
      timeout,
      customFetch,
      beforeFetch,
      afterFetch,
      onFetchErrorCallback,
      updateDataOnError,
      abort,
      loading,
      supportsAbort,
    ]
  )

  // -------------------------------------------------------------------------
  // useEffect Hooks
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (options.immediate && !hasExecutedRef.current) {
      execute()
    }
  }, [execute, options.immediate])

  useEffect(() => {
    if (
      options.refetch &&
      hasExecutedRef.current &&
      url !== previousUrlRef.current
    ) {
      execute()
    }
    if (url !== previousUrlRef.current) {
      previousUrlRef.current = url
    }
  }, [execute, url, options.refetch])

  // -------------------------------------------------------------------------
  // Method & Type Setting Callbacks
  // -------------------------------------------------------------------------

  const shell = useMemo<UseFetchReturn<T>>(
    () => ({
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
      onFetchResponse: responseEventRef.current.on,
      onFetchError: errorEventRef.current.on,
      onFetchFinally: finallyEventRef.current.on,

      // Placeholder functions that will be replaced by setMethod and setType
      get: (() => ({})) as any,
      post: (() => ({})) as any,
      put: (() => ({})) as any,
      delete: (() => ({})) as any,
      patch: (() => ({})) as any,
      head: (() => ({})) as any,
      options: (() => ({})) as any,
      json: (() => ({})) as any,
      text: (() => ({})) as any,
      blob: (() => ({})) as any,
      arrayBuffer: (() => ({})) as any,
      formData: (() => ({})) as any,
    }),
    [
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
    ]
  )

  const waitUntilFinished = useCallback(() => {
    return new Promise<UseFetchReturn<T>>((resolve) => {
      if (isFinished) {
        resolve(shell)
      } else {
        const unsubscribe = finallyEventRef.current.on(() => {
          unsubscribe()
          resolve(shell)
        })
      }
    })
  }, [isFinished, shell])

  const setMethod = useCallback(
    (method: HttpMethod) => {
      return <U,>(
        payload?: unknown,
        payloadType?: string
      ): UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>> => {
        configRef.current.method = method
        configRef.current.payload = payload
        configRef.current.payloadType = payloadType

        const thenableShell: UseFetchReturn<U> &
          PromiseLike<UseFetchReturn<U>> = {
          ...(shell as any), // Cast as any to avoid type errors
          then(onFulfilled: any, onRejected: any) {
            if (!isFetching) {
              execute().catch(() => {})
            }
            return waitUntilFinished().then(onFulfilled, onRejected)
          },
        }
        return thenableShell
      }
    },
    [execute, isFetching, shell, waitUntilFinished]
  )

  const setType = useCallback(
    (type: DataType) => {
      return <DataTypeNew,>(): UseFetchReturn<DataTypeNew> &
        PromiseLike<UseFetchReturn<DataTypeNew>> => {
        configRef.current.type = type

        const thenableShell: UseFetchReturn<DataTypeNew> &
          PromiseLike<UseFetchReturn<DataTypeNew>> = {
          ...(shell as any),
          then(onFulfilled: any, onRejected: any) {
            return waitUntilFinished().then(onFulfilled, onRejected)
          },
        }
        return thenableShell
      }
    },
    [shell, waitUntilFinished]
  )

  // -------------------------------------------------------------------------
  // Shell & waitUntilFinished
  // -------------------------------------------------------------------------

  // The 'shell' provides a consistent interface to the hook, even before a fetch has completed.

  // -------------------------------------------------------------------------
  // Final Returned Object (with Method & Type Bindings)
  // -------------------------------------------------------------------------

  // Explicitly define the type of finalShell
  const finalShell = useMemo<
    UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>
  >(() => {
    const base = { ...shell }
    base.get = setMethod('GET')
    base.post = setMethod('POST')
    base.put = setMethod('PUT')
    base.delete = setMethod('DELETE')
    base.patch = setMethod('PATCH')
    base.head = setMethod('HEAD')
    base.options = setMethod('OPTIONS')
    base.json = setType('json')
    base.text = setType('text')
    base.blob = setType('blob')
    base.arrayBuffer = setType('arrayBuffer')
    base.formData = setType('formData')

    const promiseLike: PromiseLike<UseFetchReturn<T>> = {
      then(onFulfilled, onRejected) {
        return waitUntilFinished().then(onFulfilled, onRejected)
      },
    }

    return {
      ...base,
      ...promiseLike, // Merge the promiseLike
    } as UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> // Explicit cast
  }, [shell, setMethod, setType, waitUntilFinished])

  return finalShell
}
