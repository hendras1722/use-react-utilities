type Fn = () => void;
interface ConfigurableEventFilter {
    eventFilter?: Function;
}
interface CloneFn<T> {
    (value: T): T;
}
interface UseRefHistoryOptions<Raw, Serialized = Raw> extends ConfigurableEventFilter {
    deep?: boolean;
    flush?: 'pre' | 'post' | 'sync';
    capacity?: number;
    clone?: boolean | CloneFn<Raw>;
    dump?: (v: Raw) => Serialized;
    parse?: (v: Serialized) => Raw;
}
interface HistoryRecord<Serialized> {
    value: Serialized;
    timestamp: number;
}
interface UseRefHistoryReturn<Raw, Serialized> {
    value: Raw;
    history: HistoryRecord<Serialized>[];
    lastUpdated: number;
    isTracking: boolean;
    pause: () => void;
    resume: (commit?: boolean) => void;
    commit: () => void;
    batch: (fn: (cancel: Fn) => void) => void;
    dispose: () => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    canUndo: boolean;
    canRedo: boolean;
    setValue: (value: Raw | ((prev: Raw) => Raw)) => void;
}
export default function useRefHistory<Raw, Serialized = Raw>(initialValue: Raw, options?: UseRefHistoryOptions<Raw, Serialized>): UseRefHistoryReturn<Raw, Serialized>;
export {};
