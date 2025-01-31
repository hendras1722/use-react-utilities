export interface UseCycleListOptions<T> {
    /**
     * The initial value of the state
     */
    initialValue?: T;
    /**
     * The default index when value is not found in the list
     */
    fallbackIndex?: number;
    /**
     * Custom function to get the index of the current value
     */
    getIndexOf?: (value: T, list: T[]) => number;
}
export interface UseCycleListReturn<T> {
    state: T;
    index: number;
    next: (n?: number) => T;
    prev: (n?: number) => T;
    /**
     * Go to a specific index
     */
    go: (i: number) => T;
}
/**
 * Cycle through a list of items
 */
export declare function useCycleList<T>(items: T[]): {
    state: T;
    next: () => void;
    prev: () => void;
};
