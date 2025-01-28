declare const CameraPage: () => {
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    takeSnapshot: () => void;
    setIsFrontCamera: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    isFrontCamera: boolean;
    stream: MediaStream | null;
    devices: MediaDeviceInfo[];
    deviceId: string | null;
    snapshotBlob: Blob | null;
    setDeviceId: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    canvasRef: import("react").RefObject<HTMLCanvasElement | null>;
    error: string | null;
    videoRef: import("react").RefObject<HTMLVideoElement | null>;
};
export default CameraPage;
