type DescriptorNamePolyfill = 'accelerometer' | 'accessibility-events' | 'ambient-light-sensor' | 'background-sync' | 'camera' | 'clipboard-read' | 'clipboard-write' | 'gyroscope' | 'magnetometer' | 'microphone' | 'notifications' | 'payment-handler' | 'persistent-storage' | 'push' | 'speaker' | 'local-fonts';
type GeneralPermissionDescriptor = PermissionDescriptor | {
    name: DescriptorNamePolyfill;
};
interface UsePermissionOptions<Controls extends boolean = false> {
    navigator?: Navigator;
    controls?: Controls;
}
interface UsePermissionReturnWithControls {
    state: PermissionState | undefined;
    isSupported: boolean;
    query: () => Promise<PermissionStatus | undefined>;
}
export default function usePermission<Controls extends boolean = false>(permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'], options?: UsePermissionOptions<Controls>): Controls extends true ? UsePermissionReturnWithControls : PermissionState | undefined;
export {};
