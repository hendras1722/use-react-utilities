interface DebounceOptions {
    maxWait?: number;
    leading?: boolean;
}
/**
 * Custom hook to debounce updates of a value while maintaining immediate access to current value.
 *
 * @param initialValue The initial value
 * @param delay The delay in milliseconds
 * @param options Debounce options
 * @returns [current value, debounced value, setValue function]
 */
export default function useDebounce<T>(initialValue: T, delay?: number, options?: DebounceOptions): [T, T, (value: T) => void];
export {};
