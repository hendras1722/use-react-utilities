type WatchCallback<T> = (newValue: T, oldValue: T | undefined) => void;
type WatchEffectCallback = () => void | (() => void);
interface UseWatchOptions {
    immediate?: boolean;
    deep?: boolean;
}
interface UseWatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync';
}
export declare function useWatch<T>(source: T | WatchEffectCallback, callback?: WatchCallback<T> | UseWatchOptions | UseWatchEffectOptions, options?: UseWatchOptions): void;
export {};
