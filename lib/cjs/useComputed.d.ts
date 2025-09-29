export interface Computed<T> {
    readonly value: T;
}
export interface WritableComputed<T> {
    value: T;
}
export declare function useComputed<T>(getter: () => T, setter?: (newValue: T) => void): Computed<T> | WritableComputed<T>;
