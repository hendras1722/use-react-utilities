import { useState, useEffect, useCallback, useMemo } from 'react';
export default function usePermission(permissionDesc, options) {
    const { controls = false, navigator = window.navigator } = options || {};
    // Check if Permissions API is supported
    const isSupported = useMemo(() => !!(navigator && 'permissions' in navigator), [navigator]);
    // State management
    const [permissionStatus, setPermissionStatus] = useState();
    const [state, setState] = useState();
    // Normalize permission descriptor
    const desc = useMemo(() => typeof permissionDesc === 'string'
        ? { name: permissionDesc }
        : permissionDesc, [permissionDesc]);
    // Update state based on permission status
    const update = useCallback(() => {
        setState(permissionStatus?.state ?? 'prompt');
    }, [permissionStatus]);
    // Query permission
    const query = useCallback(async () => {
        if (!isSupported)
            return;
        if (!permissionStatus) {
            try {
                const status = await navigator.permissions.query(desc);
                setPermissionStatus(status);
                update();
                return status;
            }
            catch {
                setPermissionStatus(undefined);
                return undefined;
            }
        }
        return permissionStatus;
    }, [isSupported, navigator, desc, update]);
    // Handle permission status changes
    useEffect(() => {
        if (!permissionStatus)
            return;
        const handleChange = () => update();
        permissionStatus.addEventListener('change', handleChange);
        return () => {
            permissionStatus.removeEventListener('change', handleChange);
        };
    }, [permissionStatus, update]);
    // Initial query
    useEffect(() => {
        query();
    }, [query]);
    // Return based on controls flag
    return (controls ? { state, isSupported, query } : state);
}
