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
export interface UseFetchOptions<T = any> {
    responseType?: ResponseType;
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    dedupingInterval?: number;
    errorRetryInterval?: number;
    errorRetryCount?: number;
    initialData?: T | null;
    payload?: unknown;
    params?: Record<string, any>;
    payloadType?: string;
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    afterFetch?: (ctx: AfterFetchContext<T>) => Promise<Partial<AfterFetchContext<T>>> | Partial<AfterFetchContext<T>>;
    onFetchError?: (ctx: OnFetchErrorContext<T>) => Promise<Partial<OnFetchErrorContext<T>>> | Partial<OnFetchErrorContext<T>>;
    useCache?: boolean;
}
export default function useFetch<T = any>(url: string | null, // Allow null url
fetchOptions?: RequestInit, options?: UseFetchOptions<T>): {
    data: T | undefined;
    error: any;
    isLoading: boolean;
    mutate: () => void;
};
export {};
