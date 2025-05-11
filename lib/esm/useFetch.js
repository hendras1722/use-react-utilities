import { useState, useEffect, useCallback, useRef } from 'react';
const payloadMapping = {
    json: 'application/json',
    text: 'text/plain',
};
// Simple in-memory cache
const cache = new Map();
const fetcher = async (url, fetchOptions, options) => {
    const { responseType = 'json', payload, payloadType, params, beforeFetch, afterFetch, } = options;
    const defaultOptions = {
        ...fetchOptions, // Menggunakan fetchOptions sebagai basis
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
            headers['Content-Type'] = payloadMapping[finalPayloadType] ?? payloadType;
            defaultOptions.headers = headers;
        }
        defaultOptions.body =
            finalPayloadType === 'json'
                ? JSON.stringify(payload)
                : payload;
    }
    let isCanceled = false;
    const context = {
        url,
        options: {
            ...defaultOptions,
            ...fetchOptions,
        },
        cancel: () => {
            isCanceled = true;
        },
    };
    console.log('context', context);
    try {
        if (beforeFetch) {
            Object.assign(context, await beforeFetch(context));
        }
        if (isCanceled) {
            throw new Error('Request cancelled');
        }
        const finalUrl = params ? url + '?' + new URLSearchParams(params) : url;
        const fetchResponse = await fetch(finalUrl, context.options);
        if (!fetchResponse.ok) {
            throw new Error(fetchResponse.statusText);
        }
        const responseData = await fetchResponse.clone()[responseType]();
        if (afterFetch) {
            const result = await afterFetch({
                data: responseData,
                response: fetchResponse,
            });
            return (result.data ?? responseData);
        }
        return responseData;
    }
    catch (error) {
        throw error;
    }
};
export default function useFetch(url, // Allow null url
fetchOptions = {}, options = {}) {
    const { initialData, revalidateOnFocus = false, revalidateOnReconnect = false, dedupingInterval = 2000, errorRetryInterval = 5000, errorRetryCount = 3, onFetchError, useCache = true, } = options;
    // Atur manual ke true jika method adalah POST, PUT, PATCH, atau DELETE
    const method = fetchOptions.method || 'GET';
    const manual = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
    // Determine initial data (cache or initialData)
    const cachedData = url && useCache ? cache.get(url) : undefined;
    const [data, setData] = useState(cachedData || initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasFetchedRef = useRef(false);
    const lastFetchedTimeRef = useRef(null);
    const retryCountRef = useRef(0);
    const timeoutIdRef = useRef(null);
    const isRequestInProgressRef = useRef(false);
    const isClient = typeof window !== 'undefined'; // Check if we're on the client-side
    const fetchData = useCallback(async () => {
        if (!url) {
            return;
        }
        // Prevent duplicate requests - especially important for POST
        if (isRequestInProgressRef.current && manual) {
            // console.log('Request already in progress, skipping duplicate request')
            return;
        }
        isRequestInProgressRef.current = true;
        setIsLoading(true);
        try {
            const fetchedData = await fetcher(url, fetchOptions, options);
            setData(fetchedData);
            if (useCache) {
                cache.set(url, fetchedData);
            }
            retryCountRef.current = 0;
            lastFetchedTimeRef.current = Date.now();
            console.log('fetchData: Successful fetch, resetting retryCount to 0');
        }
        catch (err) {
            setError(err);
            console.error('fetchData: Fetch error:', err);
            if (onFetchError) {
                await onFetchError({ data: null, error: err, response: null });
            }
            if (retryCountRef.current < errorRetryCount) {
                retryCountRef.current++;
                console.log(`fetchData: Retrying fetch, attempt ${retryCountRef.current}/${errorRetryCount}`);
                timeoutIdRef.current = setTimeout(() => {
                    isRequestInProgressRef.current = false; // Reset flag before retry
                    fetchData();
                }, errorRetryInterval);
            }
            else {
                console.log('fetchData: Max retries reached, not retrying further');
            }
        }
        finally {
            if (!timeoutIdRef.current) {
                // Don't reset if we're about to retry
                isRequestInProgressRef.current = false;
            }
            setIsLoading(false);
        }
    }, [
        url,
        fetchOptions,
        options,
        onFetchError,
        useCache,
        errorRetryCount,
        errorRetryInterval,
        manual, // Add manual to dependencies
    ]);
    const mutate = useCallback(() => {
        if (url) {
            cache.delete(url);
        }
        hasFetchedRef.current = false;
        fetchData(); // Panggil fetchData di dalam mutate
    }, [url, fetchData]);
    //Revalidation
    const revalidate = useCallback(() => {
        if (url) {
            fetchData();
        }
    }, [url, fetchData]);
    useEffect(() => {
        // Only run on client-side
        if (isClient && url && !hasFetchedRef.current && !manual) {
            // Periksa opsi manual
            hasFetchedRef.current = true;
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, isClient, manual]);
    //Revalidate on Focus
    useEffect(() => {
        if (!revalidateOnFocus || !isClient)
            return;
        const handleFocus = () => {
            if (!url)
                return;
            if (lastFetchedTimeRef.current === null ||
                Date.now() - (lastFetchedTimeRef.current || 0) >= dedupingInterval) {
                revalidate();
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [url, revalidateOnFocus, dedupingInterval, revalidate, isClient]);
    //Revalidate on Reconnect
    useEffect(() => {
        if (!revalidateOnReconnect || !isClient)
            return;
        const handleReconnect = () => {
            if (!url)
                return;
            revalidate();
        };
        window.addEventListener('online', handleReconnect);
        return () => window.removeEventListener('online', handleReconnect); // Fixed: was 'focus' before
    }, [url, revalidateOnReconnect, revalidate, isClient]);
    //Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                console.log('useEffect cleanup: Clearing timeout');
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);
    return { data, error, isLoading, mutate };
}
