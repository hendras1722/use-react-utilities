interface IdleDetectorOptions {
    idleTimeout?: number;
    syncInterval?: number;
    storageKey?: string;
    onIdleChange?: (isIdle: boolean) => void;
}
export declare function useIdlePage(options?: IdleDetectorOptions): {
    isIdle: boolean;
    isSystemIdle: boolean;
    resetActivity: () => void;
    checkIdle: () => boolean;
};
export {};
