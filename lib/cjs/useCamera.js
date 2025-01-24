"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCamera;
const react_1 = require("react");
function useCamera(customConstraints = {
    audio: false,
    video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
        frameRate: { ideal: 30 },
    },
}) {
    const [loadingVideos, setLoadingVideos] = (0, react_1.useState)(true);
    const [stream, setStream] = (0, react_1.useState)(null);
    // const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
    const facingMode = (0, react_1.useRef)('user');
    const [picture, setPicture] = (0, react_1.useState)(null);
    const start = async () => {
        try {
            setLoadingVideos(true);
            // Enumerate devices and filter video inputs
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            if (videoDevices.length === 0) {
                throw new Error('No video input devices found.');
            }
            // Select device based on facing mode
            const deviceId = facingMode.current === 'environment'
                ? videoDevices[videoDevices.length - 1]?.deviceId
                : videoDevices[0]?.deviceId;
            // Update constraints with selected device
            const constraints = {
                audio: false,
                video: {
                    ...customConstraints.video,
                    facingMode: facingMode.current,
                    deviceId: { exact: deviceId },
                },
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            // Attach the stream to the video element
            const videoElement = document.getElementById('video');
            if (videoElement) {
                videoElement.srcObject = mediaStream;
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                };
            }
            setStream(mediaStream);
        }
        catch (error) {
            console.error('Error starting camera:', error);
            alert("Camera could not be started. Please check your browser's permissions or try a different device.");
        }
        finally {
            setLoadingVideos(false);
        }
    };
    const stop = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        const videoElement = document.getElementById('video');
        if (videoElement) {
            videoElement.srcObject = null;
        }
    };
    const switchCamera = async (mode) => {
        stop();
        facingMode.current = mode;
        start();
    };
    const refreshCamera = async () => {
        stop();
        start();
    };
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
    return {
        stream,
        loadingVideos,
        start,
        stop,
        switchCamera,
        picture,
        takeSnapshot,
        refreshCamera,
    };
}
