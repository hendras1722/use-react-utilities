"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Custom hook to debounce updates of a value while maintaining immediate access to current value.
 *
 * @param initialValue The initial value
 * @param delay The delay in milliseconds
 * @param options Debounce options
 * @returns [current value, debounced value, setValue function]
 */
function useDebounce(initialValue, delay = 200, options = {}) {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    const [debouncedValue, setDebouncedValue] = (0, react_1.useState)(initialValue);
    const timeoutRef = (0, react_1.useRef)(null);
    const maxWaitRef = (0, react_1.useRef)(null);
    const lastCallTimeRef = (0, react_1.useRef)(Date.now());
    (0, react_1.useEffect)(() => {
        const handleMaxWait = () => {
            if (options.maxWait &&
                Date.now() - lastCallTimeRef.current >= options.maxWait) {
                if (maxWaitRef.current) {
                    clearTimeout(maxWaitRef.current);
                }
                setDebouncedValue(value);
                lastCallTimeRef.current = Date.now();
            }
        };
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Set maxWait timeout if needed
        if (options.maxWait) {
            if (maxWaitRef.current) {
                clearTimeout(maxWaitRef.current);
            }
            maxWaitRef.current = setTimeout(handleMaxWait, options.maxWait);
        }
        // Handle leading call
        if (options.leading && lastCallTimeRef.current === 0) {
            setDebouncedValue(value);
            lastCallTimeRef.current = Date.now();
            return;
        }
        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value);
            lastCallTimeRef.current = Date.now();
        }, delay);
        // Cleanup function
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (maxWaitRef.current) {
                clearTimeout(maxWaitRef.current);
            }
        };
    }, [value, delay, options.maxWait, options.leading]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (maxWaitRef.current) {
                clearTimeout(maxWaitRef.current);
            }
        };
    }, []);
    return [value, debouncedValue, setValue];
}
exports.default = useDebounce;
