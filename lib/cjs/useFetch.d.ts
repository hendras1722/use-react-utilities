type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
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
interface UseFetchOptions<T = any> {
    responseType?: ResponseType;
    method?: HttpMethod;
    immediate?: boolean;
    timeout?: number;
    updateDataOnError?: boolean;
    initialData?: T | null;
    payload?: unknown;
    params?: Record<string, any>;
    payloadType?: string;
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    afterFetch?: (ctx: AfterFetchContext<T>) => Promise<Partial<AfterFetchContext<T>>> | Partial<AfterFetchContext<T>>;
    onFetchError?: (ctx: OnFetchErrorContext<T>) => Promise<Partial<OnFetchErrorContext<T>>> | Partial<OnFetchErrorContext<T>>;
}
export default function useFetch<T = any>(url: string, fetchOptions?: RequestInit, options?: UseFetchOptions<T>): {
    isFinished: boolean;
    isFetching: boolean;
    statusCode: number | null;
    response: Response | null;
    error: any;
    data: T | null;
    canAbort: boolean;
    aborted: boolean;
    abort: () => void;
    execute: (throwOnFailed?: boolean) => Promise<Response | null>;
    refetch: () => Promise<Response | null>;
};
export {};
