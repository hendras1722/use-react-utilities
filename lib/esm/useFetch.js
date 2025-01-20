import { useState, useEffect, useCallback, useRef } from 'react';
const payloadMapping = {
    json: 'application/json',
    text: 'text/plain',
};
export default function useFetch(url, fetchOptions = {}, options = {}) {
    const { responseType = 'json', method = 'GET', immediate = true, timeout = 0, updateDataOnError = false, initialData = null, payload, payloadType, } = options;
    const [isFinished, setIsFinished] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [statusCode, setStatusCode] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState(initialData);
    const [aborted, setAborted] = useState(false);
    const hasFetched = useRef(false);
    const abortController = useRef(null);
    const timeoutId = useRef(null);
    const executeCounter = useRef(0);
    const canAbort = typeof AbortController === 'function' && isFetching;
    const abort = useCallback(() => {
        if (typeof AbortController === 'function') {
            abortController.current?.abort();
            abortController.current = new AbortController();
            setAborted(true);
        }
    }, []);
    const execute = useCallback(async (throwOnFailed = false) => {
        abort();
        setIsFetching(true);
        setIsFinished(false);
        setError(null);
        setStatusCode(null);
        setAborted(false);
        executeCounter.current += 1;
        const currentExecuteCounter = executeCounter.current;
        const defaultFetchOptions = {
            method,
            headers: {},
        };
        if (payload) {
            const headers = { ...defaultFetchOptions.headers };
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
            }
            defaultFetchOptions.body =
                finalPayloadType === 'json'
                    ? JSON.stringify(payload)
                    : payload;
        }
        let isCanceled = false;
        const context = {
            url,
            options: {
                ...defaultFetchOptions,
                ...fetchOptions,
                signal: abortController.current?.signal,
            },
            cancel: () => {
                isCanceled = true;
            },
        };
        if (options.beforeFetch) {
            Object.assign(context, await options.beforeFetch(context));
        }
        if (isCanceled) {
            setIsFetching(false);
            return null;
        }
        if (timeout) {
            timeoutId.current = setTimeout(abort, timeout);
        }
        let responseData = null;
        try {
            const fetchResponse = await fetch(context.url, {
                ...context.options,
                headers: {
                    ...defaultFetchOptions.headers,
                    ...context.options?.headers,
                },
            });
            setResponse(fetchResponse);
            setStatusCode(fetchResponse.status);
            responseData = await fetchResponse.clone()[responseType]();
            if (!fetchResponse.ok) {
                setData(initialData);
                throw new Error(fetchResponse.statusText);
            }
            if (options.afterFetch) {
                const result = await options.afterFetch({
                    data: responseData,
                    response: fetchResponse,
                });
                responseData = result.data ?? responseData;
            }
            setData(responseData);
            return fetchResponse;
        }
        catch (fetchError) {
            let errorData = fetchError.message || fetchError.name;
            if (options.onFetchError) {
                const result = await options.onFetchError({
                    data: responseData,
                    error: fetchError,
                    response: response,
                });
                errorData = result.error ?? errorData;
                responseData = result.data ?? responseData;
            }
            setError(errorData);
            if (updateDataOnError) {
                setData(responseData);
            }
            if (throwOnFailed) {
                throw fetchError;
            }
            return null;
        }
        finally {
            if (currentExecuteCounter === executeCounter.current) {
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
        method,
        payload,
        payloadType,
        responseType,
        initialData,
        timeout,
        updateDataOnError,
    ]);
    const refetch = useCallback(() => execute(), [execute]);
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);
    useEffect(() => {
        if (!immediate && !hasFetched.current) {
            hasFetched.current = true;
            execute();
        }
    }, []);
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
