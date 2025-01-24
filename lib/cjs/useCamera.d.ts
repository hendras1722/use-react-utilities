interface UseUserMediaOptions {
    enabled?: boolean;
    autoSwitch?: boolean;
    constraints?: MediaStreamConstraints;
    navigator?: Navigator;
}
declare global {
    interface Window {
        stream: MediaStream | null;
    }
}
export default function useUserMedia(options?: UseUserMediaOptions): {
    isSupported: boolean;
    stream: MediaStream | null;
    start: () => Promise<MediaStream | null>;
    stop: () => void;
    restart: () => Promise<MediaStream | null>;
    constraints: MediaStreamConstraints;
    enabled: boolean;
    autoSwitch: boolean;
    setConstraints: import("react").Dispatch<import("react").SetStateAction<MediaStreamConstraints>>;
    setEnabled: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    error: Error | null;
    picture: string | null;
    takeSnapshot: () => void;
};
export type UseUserMediaReturn = ReturnType<typeof useUserMedia>;
export {};
