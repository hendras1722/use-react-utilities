"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDevicesList;
const react_1 = require("react");
const usePermission_1 = __importDefault(require("./usePermission"));
function useDevicesList({ navigator = window.navigator, controls = true, requestPermissions = false, onUpdated, constraints = { audio: true, video: true }, } = {}) {
    const [devices, setDevices] = (0, react_1.useState)([]);
    const [permissionGranted, setPermissionGranted] = (0, react_1.useState)(false);
    const [stream, setStream] = (0, react_1.useState)(null);
    // Check device support
    const isSupported = (0, react_1.useMemo)(() => !!navigator?.mediaDevices?.enumerateDevices, [navigator]);
    // Permission hook
    const { state, query } = (0, usePermission_1.default)('camera', { controls: true });
    // Filtered device lists
    const videoInputs = (0, react_1.useMemo)(() => devices.filter((device) => device.kind === 'videoinput'), [devices]);
    const audioInputs = (0, react_1.useMemo)(() => devices.filter((device) => device.kind === 'audioinput'), [devices]);
    const audioOutputs = (0, react_1.useMemo)(() => devices.filter((device) => device.kind === 'audiooutput'), [devices]);
    // Update devices list
    const update = (0, react_1.useCallback)(async () => {
        if (!isSupported)
            return;
        try {
            const updatedDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices(updatedDevices);
            onUpdated?.(updatedDevices);
            // Clean up previous stream
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
        }
        catch (error) {
            console.error('Error updating devices:', error);
        }
    }, [isSupported, navigator, onUpdated, stream]);
    // Ensure permissions
    const ensurePermissions = (0, react_1.useCallback)(async () => {
        if (!isSupported)
            return false;
        try {
            // Query existing permission state
            await query();
            // If not granted, request media access
            if (state !== 'granted') {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    setStream(mediaStream);
                    setPermissionGranted(true);
                }
                catch {
                    setStream(null);
                    setPermissionGranted(false);
                    return false;
                }
            }
            else {
                setPermissionGranted(true);
            }
            // Update device list after permission
            await update();
            return true;
        }
        catch (error) {
            console.error('Permission error:', error);
            setPermissionGranted(false);
            return false;
        }
    }, [isSupported, state, query, navigator, constraints, update]);
    // Handle device changes and initial setup
    (0, react_1.useEffect)(() => {
        if (!isSupported)
            return;
        const handleDeviceChange = () => {
            update();
        };
        // Initial setup
        if (requestPermissions) {
            ensurePermissions();
        }
        else {
            update();
        }
        // Listen for device changes
        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
        // Cleanup
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [
        isSupported,
        navigator,
        requestPermissions,
        ensurePermissions,
        update,
        stream,
    ]);
    // Prepare return object
    const result = {
        devices,
        videoInputs,
        audioInputs,
        audioOutputs,
        permissionGranted,
        ensurePermissions,
        isSupported,
    };
    return controls ? result : videoInputs;
}
