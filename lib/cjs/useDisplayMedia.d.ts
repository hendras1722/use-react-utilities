interface useDisplayMediaOptions {
    audio?: boolean;
    video?: boolean | MediaTrackConstraints;
}
declare function useDisplayMedia(options?: useDisplayMediaOptions): {
    stream: MediaStream | null;
    error: Error | null;
    startSharing: () => Promise<void>;
    stopSharing: () => void;
    isSharing: boolean;
};
export { useDisplayMedia };
