"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useUserMedia;
const react_1 = require("react");
const useSupported_1 = __importDefault(require("./useSupported"));
const usePermission_1 = __importDefault(require("./usePermission"));
function useUserMedia(options = {}) {
    const { enabled: initialEnabled = false, autoSwitch = true, constraints: initialConstraints = { video: true, audio: false }, navigator = window.navigator, } = options;
    const [stream, setStream] = (0, react_1.useState)(null);
    const [enabled, setEnabled] = (0, react_1.useState)(initialEnabled);
    const [constraints, setConstraints] = (0, react_1.useState)(initialConstraints);
    const [error, setError] = (0, react_1.useState)(null);
    const isSupported = (0, useSupported_1.default)(() => checkSupport());
    const cameraPermission = (0, usePermission_1.default)('camera');
    const streamRef = (0, react_1.useRef)(null);
    const checkSupport = () => {
        return cameraPermission;
    };
    const start = (0, react_1.useCallback)(async () => {
        if (!isSupported) {
            setError(new Error('Media devices not supported'));
            return null;
        }
        try {
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            window.stream = newStream;
            setStream(newStream);
            streamRef.current = newStream;
            setEnabled(true);
            setError(null);
            return newStream;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access media devices';
            setError(new Error(errorMessage));
            setStream(null);
            setEnabled(false);
            return null;
        }
    }, [isSupported, constraints]);
    const stop = (0, react_1.useCallback)(() => {
        const videos = document.querySelector('video');
        if (!videos)
            return;
        const tracks = videos?.srcObject?.getTracks();
        if (!tracks)
            return;
        tracks.forEach((track) => {
            track.stop();
        });
        videos.srcObject = null;
    }, []);
    const restart = (0, react_1.useCallback)(async () => {
        stop();
        return await start();
    }, [stop, start]);
    const [picture, setPicture] = (0, react_1.useState)(null);
    function takeSnapshot() {
        const video = document.getElementsByTagName('video')[0];
        const width = video.offsetWidth;
        const height = video.offsetHeight;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, width, height);
        }
        canvas.toBlob((blob) => {
            // const newImg = document.createElement('img')
            if (blob) {
                const url = URL.createObjectURL(blob);
                setPicture(url);
            }
            else {
                console.error('Failed to create blob');
            }
            // newImg.onload = () => {
            //   // no longer need to read the blob so it's revoked
            //   URL.revokeObjectURL(url)
            // }
            // URL.revokeObjectURL(url)
            // newImg.src = url
            // document.body.appendChild(newImg)
        });
        // setPicture(canvas.toDataURL('image/png'))
    }
    (0, react_1.useEffect)(() => {
        if (picture) {
            return URL.revokeObjectURL(picture);
        }
    }, [picture]);
    (0, react_1.useEffect)(() => {
        if (enabled && isSupported) {
            start();
        }
        else {
            stop();
        }
    }, [enabled, isSupported]);
    // useEffect(() => {
    //   if (autoSwitch && stream) {
    //     restart()
    //   }
    // }, [constraints, autoSwitch, restart])
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            stop();
        };
    }, [stop]);
    return {
        isSupported,
        stream,
        start,
        stop,
        restart,
        constraints,
        enabled,
        autoSwitch,
        setConstraints,
        setEnabled,
        error,
        picture,
        takeSnapshot,
    };
}
