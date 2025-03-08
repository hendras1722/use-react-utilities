interface UseDisplayMediaOptions {
    audio?: boolean;
    video?: boolean | MediaTrackConstraints;
}
declare function useDisplayMedia(options?: UseDisplayMediaOptions): {
    stream: MediaStream | null;
    error: Error | null;
    startSharing: () => Promise<void>;
    stopSharing: () => void;
    isSharing: boolean;
};
export { useDisplayMedia };
