import { useEffect, useLayoutEffect } from 'react';
import { useRef } from './useRef';
export function OnMounted(callback) {
    useEffect(() => {
        callback();
    }, []);
}
export function OnUnmounted(callback) {
    useEffect(() => {
        return () => {
            callback();
        };
    }, []);
}
export function OnUpdated(callback) {
    const hasMounted = useRef(false);
    useEffect(() => {
        if (hasMounted.value) {
            callback();
        }
        else {
            hasMounted.value = true;
        }
    });
}
export function OnBeforeUpdate(callback) {
    const isFirstRender = useRef(true);
    useLayoutEffect(() => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
            return;
        }
        callback();
    });
}
export function OnBeforeUnmount(callback) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        return () => {
            callbackRef.value();
        };
    }, []);
}
export function OnBeforeMount(callback) {
    const hasRun = useRef(false);
    if (!hasRun.value) {
        callback();
        hasRun.value = true;
    }
}
