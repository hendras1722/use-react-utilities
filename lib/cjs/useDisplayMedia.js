"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDisplayMedia = useDisplayMedia;
const react_1 = require("react");
function useDisplayMedia(options = {}) {
    const { audio = false, video = true } = options;
    const [stream, setStream] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [isSharing, setIsSharing] = (0, react_1.useState)(false); // Track if screen sharing is active
    const streamRef = (0, react_1.useRef)(null); // Menyimpan stream di ref
    const startSharing = (0, react_1.useCallback)(async () => {
        setIsSharing(true);
        try {
            const newStream = await navigator.mediaDevices.getDisplayMedia({
                video: video,
                audio: audio,
            });
            streamRef.current = newStream;
            setStream(newStream);
            setError(null);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            console.error('Error getting screen share:', error);
            setIsSharing(false); // Reset isSharing on error
            setStream(null);
        }
    }, [audio, video]);
    const stopSharing = (0, react_1.useCallback)(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setStream(null);
            setError(null);
        }
        setIsSharing(false);
    }, []);
    (0, react_1.useEffect)(() => {
        return () => {
            // Cleanup stream when the component unmounts
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);
    return {
        stream,
        error,
        startSharing,
        stopSharing,
        isSharing,
    };
}
