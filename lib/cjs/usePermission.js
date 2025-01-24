"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePermission;
const react_1 = require("react");
function usePermission(permissionDesc, options) {
    const { controls = false, navigator = window.navigator } = options || {};
    // Check if Permissions API is supported
    const isSupported = (0, react_1.useMemo)(() => !!(navigator && 'permissions' in navigator), [navigator]);
    // State management
    const [permissionStatus, setPermissionStatus] = (0, react_1.useState)();
    const [state, setState] = (0, react_1.useState)();
    // Normalize permission descriptor
    const desc = (0, react_1.useMemo)(() => typeof permissionDesc === 'string'
        ? { name: permissionDesc }
        : permissionDesc, [permissionDesc]);
    // Update state based on permission status
    const update = (0, react_1.useCallback)(() => {
        setState(permissionStatus?.state ?? 'prompt');
    }, [permissionStatus]);
    // Query permission
    const query = (0, react_1.useCallback)(async () => {
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
    (0, react_1.useEffect)(() => {
        if (!permissionStatus)
            return;
        const handleChange = () => update();
        permissionStatus.addEventListener('change', handleChange);
        return () => {
            permissionStatus.removeEventListener('change', handleChange);
        };
    }, [permissionStatus, update]);
    // Initial query
    (0, react_1.useEffect)(() => {
        query();
    }, [query]);
    // Return based on controls flag
    return (controls ? { state, isSupported, query } : state);
}
