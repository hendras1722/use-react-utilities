"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useIntersectionObserver;
const react_1 = require("react");
const useSupported_1 = __importDefault(require("./useSupported"));
const defaultWindow = typeof window !== 'undefined' ? window : undefined;
function useIntersectionObserver(target, callback, options = {}) {
    const { root, rootMargin = '0px', threshold = 0, window = defaultWindow, immediate = true, } = options;
    const isSupported = (0, useSupported_1.default)(() => window && 'IntersectionObserver' in window);
    const [isActive, setIsActive] = (0, react_1.useState)(immediate);
    const observerRef = (0, react_1.useRef)(null);
    const targetsRef = (0, react_1.useRef)([]);
    const getTargets = (0, react_1.useCallback)(() => {
        if (Array.isArray(target)) {
            return target
                .map((t) => (t && 'current' in t ? t.current : t))
                .filter(Boolean);
        }
        const singleTarget = target && 'current' in target ? target.current : target;
        return singleTarget ? [singleTarget] : [];
    }, [target]);
    const cleanup = (0, react_1.useCallback)(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
    }, []);
    (0, react_1.useEffect)(() => {
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
    const stop = (0, react_1.useCallback)(() => {
        cleanup();
        setIsActive(false);
    }, [cleanup]);
    const pause = (0, react_1.useCallback)(() => {
        cleanup();
        setIsActive(false);
    }, [cleanup]);
    const resume = (0, react_1.useCallback)(() => {
        setIsActive(true);
    }, []);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
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
