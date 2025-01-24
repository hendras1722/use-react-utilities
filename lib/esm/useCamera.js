import { useState, useEffect, useCallback, useRef } from 'react';
import useSupported from './useSupported';
import usePermission from './usePermission';
export default function useUserMedia(options = {}) {
    const { enabled: initialEnabled = false, autoSwitch = true, constraints: initialConstraints = { video: true, audio: false }, navigator = window.navigator, } = options;
    const [stream, setStream] = useState(null);
    const [enabled, setEnabled] = useState(initialEnabled);
    const [constraints, setConstraints] = useState(initialConstraints);
    const [error, setError] = useState(null);
    const isSupported = useSupported(() => checkSupport());
    const cameraPermission = usePermission('camera');
    const streamRef = useRef(null);
    const checkSupport = () => {
        return cameraPermission;
    };
    const start = useCallback(async () => {
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
    const stop = useCallback(() => {
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
    const restart = useCallback(async () => {
        stop();
        return await start();
    }, [stop, start]);
    const [picture, setPicture] = useState(null);
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
    useEffect(() => {
        if (picture) {
            return URL.revokeObjectURL(picture);
        }
    }, [picture]);
    useEffect(() => {
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
    useEffect(() => {
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
