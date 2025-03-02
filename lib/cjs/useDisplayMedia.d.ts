interface UseDisplayMediaOptions {
    enabled?: boolean;
    video?: boolean | MediaTrackConstraints | undefined;
    audio?: boolean | MediaTrackConstraints | undefined;
    navigator?: Navigator;
}
export declare function useDisplayMedia(options?: UseDisplayMediaOptions): {
    isSupported: boolean;
    stream: MediaStream | undefined;
    error: Error | null;
    start: () => Promise<MediaStream | undefined>;
    stop: () => void;
    enabled: boolean;
    setEnabled: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export type UseDisplayMediaReturn = ReturnType<typeof useDisplayMedia>;
export {};
