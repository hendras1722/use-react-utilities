type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
export interface UseFetchOptions<T = any> {
    /**
     * Response data type
     * @default 'json'
     */
    responseType?: ResponseType;
    /**
     * HTTP method
     * @default 'GET'
     */
    method?: HttpMethod;
    /**
     * Request payload for POST, PUT, PATCH methods
     */
    payload?: unknown;
    /**
     * Content-Type header for the payload
     * @default 'application/json' for object/array payloads
     */
    payloadType?: string;
    /**
     * Will automatically run fetch when component mounts
     * @default true
     */
    immediate?: boolean;
    /**
     * Initial data before the request finished
     * @default null
     */
    initialData?: T | null;
    /**
     * Timeout for abort request after number of milliseconds
     * `0` means use browser default
     * @default 0
     */
    timeout?: number;
    /**
     * Allow updating the data when fetch errors
     * @default false
     */
    updateDataOnError?: boolean;
    /**
     * Will run immediately before the fetch request is dispatched
     */
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    /**
     * Will run immediately after the fetch request is returned.
     * Runs after any 2xx response
     */
    afterFetch?: (ctx: AfterFetchContext<T>) => Promise<Partial<AfterFetchContext<T>>> | Partial<AfterFetchContext<T>>;
    /**
     * Will run immediately after the fetch request is returned.
     * Runs after any 4xx and 5xx response
     */
    onFetchError?: (ctx: OnFetchErrorContext<T>) => Promise<Partial<OnFetchErrorContext<T>>> | Partial<OnFetchErrorContext<T>>;
}
interface BeforeFetchContext {
    url: string;
    options: RequestInit;
    cancel: () => void;
}
interface AfterFetchContext<T = any> {
    response: Response;
    data: T | null;
}
interface OnFetchErrorContext<T = any> {
    error: any;
    data: T | null;
    response: Response | null;
}
interface UseFetchReturn<T> {
    /**
     * Indicates if the fetch request has finished
     */
    isFinished: boolean;
    /**
     * Indicates if the request is currently being fetched
     */
    isFetching: boolean;
    /**
     * The statusCode of the HTTP fetch response
     */
    statusCode: number | null;
    /**
     * The raw response of the fetch response
     */
    response: Response | null;
    /**
     * Any fetch errors that may have occurred
     */
    error: any;
    /**
     * The fetch response body on success
     */
    data: T | null;
    /**
     * Indicates if the fetch request is able to be aborted
     */
    canAbort: boolean;
    /**
     * Indicates if the fetch request was aborted
     */
    aborted: boolean;
    /**
     * Abort the fetch request
     */
    abort: () => void;
    /**
     * Manually call the fetch
     * @param throwOnFailed Whether to throw an error on failed requests
     */
    execute: (throwOnFailed?: boolean) => Promise<Response | null>;
    /**
     * Refetch the data using current options
     */
    refetch: () => Promise<Response | null>;
}
export default function useFetch<T = any>(url: string, fetchOptions?: RequestInit, options?: UseFetchOptions<T>): UseFetchReturn<T>;
export {};
