export interface UseFetchReturn<T> {
    isFinished: boolean;
    statusCode: number | null;
    response: Response | null;
    error: any;
    data: T | null;
    isFetching: boolean;
    canAbort: boolean;
    aborted: boolean;
    abort: () => void;
    execute: (throwOnFailed?: boolean) => Promise<any>;
    onFetchResponse: (callback: (response: Response) => void) => () => void;
    onFetchError: (callback: (error: any) => void) => () => void;
    onFetchFinally: (callback: () => void) => () => void;
    get: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    post: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    put: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    delete: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    patch: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    head: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    options: <U>(payload?: any, type?: string) => UseFetchReturn<U> & PromiseLike<UseFetchReturn<U>>;
    json: <JSON>() => UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>;
    text: () => UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>;
    blob: () => UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>;
    arrayBuffer: () => UseFetchReturn<ArrayBuffer> & PromiseLike<UseFetchReturn<ArrayBuffer>>;
    formData: () => UseFetchReturn<FormData> & PromiseLike<UseFetchReturn<FormData>>;
}
type Combination = 'overwrite' | 'chain';
export interface BeforeFetchContext {
    url: string;
    options: RequestInit;
    cancel: () => void;
}
export interface AfterFetchContext<T = any> {
    response: Response;
    data: T | null;
    context: BeforeFetchContext;
    execute: (throwOnFailed?: boolean) => Promise<any>;
}
export interface OnFetchErrorContext<T = any, E = any> {
    error: E;
    data: T | null;
    response: Response | null;
    context: BeforeFetchContext;
    execute: (throwOnFailed?: boolean) => Promise<any>;
}
export interface UseFetchOptions {
    fetch?: typeof window.fetch;
    immediate?: boolean;
    refetch?: boolean;
    initialData?: any;
    timeout?: number;
    updateDataOnError?: boolean;
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>;
    onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>;
}
export interface CreateFetchOptions {
    baseUrl?: string;
    combination?: Combination;
    options?: UseFetchOptions;
    fetchOptions?: RequestInit;
}
export declare function createFetch(config?: CreateFetchOptions): <T>(url: string, ...args: any[]) => UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export declare function useFetch<T>(url: string): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export declare function useFetch<T>(url: string, useFetchOptions: UseFetchOptions): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export declare function useFetch<T>(url: string, options: RequestInit, useFetchOptions?: UseFetchOptions): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export {};
