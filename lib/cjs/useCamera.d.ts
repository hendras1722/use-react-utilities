export default function useCamera(customConstraints?: MediaStreamConstraints): {
    stream: MediaStream | null;
    loadingVideos: boolean;
    start: () => Promise<void>;
    stop: () => void;
    switchCamera: (mode: "user" | "environment") => Promise<void>;
    picture: string | null;
    takeSnapshot: () => void;
    refreshCamera: () => Promise<void>;
};
