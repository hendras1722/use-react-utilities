import { useEffect, useRef, useState, useCallback } from 'react';
import useSupported from './useSupported';
const defaultWindow = typeof window !== 'undefined' ? window : undefined;
export default function useIntersectionObserver(target, callback, options = {}) {
    const { root, rootMargin = '0px', threshold = 0, window = defaultWindow, immediate = true, } = options;
    const isSupported = useSupported(() => window && 'IntersectionObserver' in window);
    const [isActive, setIsActive] = useState(immediate);
    const observerRef = useRef(null);
    const targetsRef = useRef([]);
    const getTargets = useCallback(() => {
        if (Array.isArray(target)) {
            return target
                .map((t) => (t && 'current' in t ? t.current : t))
                .filter(Boolean);
        }
        const singleTarget = target && 'current' in target ? target.current : target;
        return singleTarget ? [singleTarget] : [];
    }, [target]);
    const cleanup = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
    }, []);
    useEffect(() => {
        if (!isSupported || !isActive)
            return;
        const targets = getTargets();
        if (targets.length === 0)
            return;
        cleanup();
        const rootElement = root && 'current' in root ? root.current : root;
        observerRef.current = new IntersectionObserver(callback, {
            root: rootElement,
            rootMargin,
            threshold,
        });
        targets.forEach((el) => {
            if (el)
                observerRef.current?.observe(el);
        });
        targetsRef.current = targets;
        return cleanup;
    }, [
        isSupported,
        isActive,
        root,
        rootMargin,
        threshold,
        callback,
        cleanup,
        getTargets,
    ]);
    const stop = useCallback(() => {
        cleanup();
        setIsActive(false);
    }, [cleanup]);
    const pause = useCallback(() => {
        cleanup();
        setIsActive(false);
    }, [cleanup]);
    const resume = useCallback(() => {
        setIsActive(true);
    }, []);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);
    return {
        isSupported,
        isActive,
        pause,
        resume,
        stop,
    };
}
