"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useFetch;
const react_1 = require("react");
const payloadMapping = {
    json: 'application/json',
    text: 'text/plain',
};
function useFetch(url, fetchOptions = {}, options = {}) {
    const { responseType = 'json', method = 'GET', immediate = false, timeout = 0, updateDataOnError = false, initialData = null, payload, payloadType, } = options;
    const [isFinished, setIsFinished] = (0, react_1.useState)(false);
    const [isFetching, setIsFetching] = (0, react_1.useState)(false);
    const [statusCode, setStatusCode] = (0, react_1.useState)(null);
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [data, setData] = (0, react_1.useState)(initialData);
    const [aborted, setAborted] = (0, react_1.useState)(false);
    const abortController = (0, react_1.useRef)(null);
    const timeoutId = (0, react_1.useRef)(null);
    const mountedRef = (0, react_1.useRef)(false);
    const initialFetchRef = (0, react_1.useRef)(false);
    const canAbort = typeof AbortController === 'function' && isFetching;
    const cleanup = (0, react_1.useCallback)(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
            timeoutId.current = null;
        }
        if (abortController.current) {
            abortController.current.abort();
            abortController.current = null;
        }
    }, []);
    const abort = (0, react_1.useCallback)(() => {
        if (typeof AbortController === 'function') {
            cleanup();
            abortController.current = new AbortController();
            setAborted(true);
        }
    }, [cleanup]);
    const createFetchOptions = (0, react_1.useCallback)(() => {
        const defaultOptions = {
            method,
            headers: { ...fetchOptions.headers },
        };
        if (payload) {
            const headers = { ...defaultOptions.headers };
            let finalPayloadType = payloadType;
            if (!finalPayloadType &&
                (Object.getPrototypeOf(payload) === Object.prototype ||
                    Array.isArray(payload)) &&
                !(payload instanceof FormData)) {
                finalPayloadType = 'json';
            }
            if (finalPayloadType) {
                headers['Content-Type'] =
                    payloadMapping[finalPayloadType] ?? finalPayloadType;
                defaultOptions.headers = headers;
            }
            defaultOptions.body =
                finalPayloadType === 'json'
                    ? JSON.stringify(payload)
                    : payload;
        }
        return defaultOptions;
    }, [method, fetchOptions.headers, payload, payloadType]);
    const execute = (0, react_1.useCallback)(async (throwOnFailed = false) => {
        if (isFetching || !mountedRef.current)
            return null;
        // Only set fetching state if we're really going to execute
        setIsFetching(true);
        setIsFinished(false);
        setError(null);
        setStatusCode(null);
        setAborted(false);
        const defaultOptions = createFetchOptions();
        let isCanceled = false;
        const context = {
            url,
            options: {
                ...defaultOptions,
                ...fetchOptions,
                signal: abortController.current?.signal,
            },
            cancel: () => {
                isCanceled = true;
            },
        };
        try {
            if (options.beforeFetch) {
                Object.assign(context, await options.beforeFetch(context));
            }
            if (isCanceled || !mountedRef.current) {
                setIsFetching(false);
                return null;
            }
            if (timeout) {
                timeoutId.current = setTimeout(abort, timeout);
            }
            const params = options.params
                ? '?' + new URLSearchParams(options.params)
                : '';
            const fetchResponse = await fetch(context.url + params, {
                ...context.options,
                headers: {
                    ...defaultOptions.headers,
                    ...context.options?.headers,
                },
            });
            if (!mountedRef.current)
                return null;
            setResponse(fetchResponse);
            setStatusCode(fetchResponse.status);
            const responseData = await fetchResponse.clone()[responseType]();
            if (!fetchResponse.ok) {
                setData(initialData);
                throw new Error(fetchResponse.statusText);
            }
            if (options.afterFetch && mountedRef.current) {
                const result = await options.afterFetch({
                    data: responseData,
                    response: fetchResponse,
                });
                const finalData = result.data ?? responseData;
                setData(finalData);
            }
            else if (mountedRef.current) {
                setData(responseData);
            }
            return fetchResponse;
        }
        catch (fetchError) {
            if (!mountedRef.current)
                return null;
            let errorData = fetchError.message || fetchError.name;
            let responseData = null;
            if (options.onFetchError) {
                const result = await options.onFetchError({
                    data: null,
                    error: fetchError,
                    response,
                });
                errorData = result.error ?? errorData;
                responseData = result.data ?? null;
            }
            if (mountedRef.current) {
                setError(errorData);
                if (updateDataOnError && responseData) {
                    setData(responseData);
                }
            }
            if (throwOnFailed) {
                throw fetchError;
            }
            return null;
        }
        finally {
            if (mountedRef.current) {
                setIsFetching(false);
                setIsFinished(true);
            }
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        }
    }, [
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
    ]);
    const refetch = (0, react_1.useCallback)(() => execute(), [execute]);
    (0, react_1.useEffect)(() => {
        mountedRef.current = true;
        if (immediate && !initialFetchRef.current) {
            initialFetchRef.current = true;
            execute();
        }
        return () => {
            mountedRef.current = false;
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [immediate, execute]);
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
    };
}
