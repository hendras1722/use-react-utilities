import { useEffect, useLayoutEffect, createContext, useContext } from 'react';
import { ref } from './useRef';
import { useWatch } from './useWatchEffect';
export function onMounted(callback) {
    useEffect(() => {
        callback();
    }, []);
}
export function onUnmounted(callback) {
    useEffect(() => {
        return () => {
            callback();
        };
    }, []);
}
export function onUpdated(callback) {
    const hasMounted = ref(false);
    useEffect(() => {
        if (hasMounted.value) {
            callback();
        }
        else {
            hasMounted.value = true;
        }
    });
}
export function onBeforeUpdate(callback) {
    const isFirstRender = ref(true);
    useLayoutEffect(() => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
            return;
        }
        callback();
    });
}
export function onBeforeUnmount(callback) {
    const callbackRef = ref(callback);
    useEffect(() => {
        return () => {
            callbackRef.value();
        };
    }, []);
}
export function onBeforeMount(callback) {
    const hasRun = ref(false);
    if (!hasRun.value) {
        callback();
        hasRun.value = true;
    }
}
const KeepAliveContext = createContext(null);
export const useActivated = (name, callback) => {
    const ctx = useContext(KeepAliveContext);
    const wasActive = ref(false);
    useWatch([ctx?.activeKey, name, callback], (newValue) => {
        console.log(newValue);
    });
    useEffect(() => {
        if (!ctx)
            return;
        const isActive = ctx.activeKey === name;
        if (isActive && !wasActive.value) {
            callback();
        }
        wasActive.value = isActive;
    });
};
