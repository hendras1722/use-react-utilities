"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useFetch;
const react_1 = require("react");
const payloadMapping = {
    json: 'application/json',
    text: 'text/plain',
};
function useFetch(url, fetchOptions = {}, options = {}) {
    const { responseType = 'json', method = 'GET', immediate = true, timeout = 0, updateDataOnError = false, initialData = null, payload, payloadType, } = options;
    const [isFinished, setIsFinished] = (0, react_1.useState)(false);
    const [isFetching, setIsFetching] = (0, react_1.useState)(false);
    const [statusCode, setStatusCode] = (0, react_1.useState)(null);
    const [response, setResponse] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [data, setData] = (0, react_1.useState)(initialData);
    const [aborted, setAborted] = (0, react_1.useState)(false);
    const hasFetched = (0, react_1.useRef)(false);
    const abortController = (0, react_1.useRef)(null);
    const timeoutId = (0, react_1.useRef)(null);
    const executeCounter = (0, react_1.useRef)(0);
    const canAbort = typeof AbortController === 'function' && isFetching;
    const abort = (0, react_1.useCallback)(() => {
        if (typeof AbortController === 'function') {
            abortController.current?.abort();
            abortController.current = new AbortController();
            setAborted(true);
        }
    }, []);
    const execute = (0, react_1.useCallback)(async (throwOnFailed = false) => {
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
    const refetch = (0, react_1.useCallback)(() => execute(), [execute]);
    (0, react_1.useEffect)(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);
    (0, react_1.useEffect)(() => {
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
