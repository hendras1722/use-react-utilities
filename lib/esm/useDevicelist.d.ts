export interface UseDevicesListOptions {
    navigator?: Navigator;
    controls?: boolean;
    requestPermissions?: boolean;
    onUpdated?: (devices: MediaDeviceInfo[]) => void;
    constraints?: MediaStreamConstraints;
}
export interface UseDevicesListResult {
    devices: MediaDeviceInfo[];
    videoInputs: MediaDeviceInfo[];
    audioInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
    permissionGranted: boolean;
    ensurePermissions: () => Promise<boolean>;
    isSupported: boolean;
}
export default function useDevicesList({ navigator, controls, requestPermissions, onUpdated, constraints, }?: UseDevicesListOptions): UseDevicesListResult | MediaDeviceInfo[];
