"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWatch = useWatch;
const react_1 = require("react");
function useWatch(source, callback, options) {
    // Determine if the hook is being used as `watch` or `watchEffect`
    const isWatchEffect = typeof source === 'function';
    if (isWatchEffect) {
        const effect = source;
        const effectOptions = callback || {};
        if (effectOptions.flush === 'pre' || effectOptions.flush === 'sync') {
            console.warn(`The 'flush' option is not directly supported by React's useEffect and will be ignored.`);
        }
        (0, react_1.useEffect)(() => {
            const cleanup = effect();
            return cleanup;
        }, [effect]);
        return;
    }
    // Use case: Vue's `watch`
    const valueToWatch = source;
    const watchCallback = callback;
    const watchOptions = options || {};
    const { immediate = false, deep = false } = watchOptions;
    const previousValue = (0, react_1.useRef)(undefined);
    const isFirstRun = (0, react_1.useRef)(true);
    // Helper function to handle deep comparison
    const isEqual = (a, b) => {
        if (!deep)
            return Object.is(a, b);
        if (a === b)
            return true;
        if (a == null || b == null)
            return a === b;
        if (typeof a !== 'object' || typeof b !== 'object')
            return false;
        // A more robust deep equality check is recommended for production.
        try {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        catch {
            return Object.is(a, b);
        }
    };
    (0, react_1.useEffect)(() => {
        if (isFirstRun.current) {
            if (immediate) {
                watchCallback(valueToWatch, previousValue.current);
            }
            isFirstRun.current = false;
            previousValue.current = valueToWatch;
            return;
        }
        if (!isEqual(valueToWatch, previousValue.current)) {
            watchCallback(valueToWatch, previousValue.current);
        }
        previousValue.current = valueToWatch;
    }, [valueToWatch, watchCallback, immediate, deep]);
}
