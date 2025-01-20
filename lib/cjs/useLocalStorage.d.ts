interface Serializer<T> {
    read: (raw: string) => T;
    write: (value: T) => string;
}
interface UseStorageOptions<T> {
    /**
     * Listen to storage changes, useful for multiple tabs application
     * @default true
     */
    listenToStorageChanges?: boolean;
    /**
     * Write the default value to the storage when it does not exist
     * @default true
     */
    writeDefaults?: boolean;
    /**
     * Merge the default value with the value read from the storage.
     * @default false
     */
    mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
    /**
     * Custom data serializer
     */
    serializer?: Serializer<T>;
    /**
     * On error callback
     */
    onError?: (error: unknown) => void;
}
export default function useStorage<T>(key: string, defaultValue: T, storage?: Storage, options?: UseStorageOptions<T>): [T, (value: T | ((prev: T) => T)) => void, () => void];
export {};
