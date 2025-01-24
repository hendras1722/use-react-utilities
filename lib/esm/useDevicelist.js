import { useState, useEffect, useCallback, useMemo } from 'react';
import usePermission from './usePermission';
export default function useDevicesList({ navigator = window.navigator, controls = true, requestPermissions = false, onUpdated, constraints = { audio: true, video: true }, } = {}) {
    const [devices, setDevices] = useState([]);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [stream, setStream] = useState(null);
    // Check device support
    const isSupported = useMemo(() => !!navigator?.mediaDevices?.enumerateDevices, [navigator]);
    // Permission hook
    const { state, query } = usePermission('camera', { controls: true });
    // Filtered device lists
    const videoInputs = useMemo(() => devices.filter((device) => device.kind === 'videoinput'), [devices]);
    const audioInputs = useMemo(() => devices.filter((device) => device.kind === 'audioinput'), [devices]);
    const audioOutputs = useMemo(() => devices.filter((device) => device.kind === 'audiooutput'), [devices]);
    // Update devices list
    const update = useCallback(async () => {
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
    const ensurePermissions = useCallback(async () => {
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
    useEffect(() => {
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
