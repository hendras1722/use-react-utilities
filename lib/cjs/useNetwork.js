'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * React hook for monitoring network status.
 *
 * @param options Configuration options
 * @returns Network state object
 */
function useNetwork(options = {}) {
    const { window: win = typeof window !== 'undefined' ? window : null } = options;
    const navigator = win?.navigator;
    const isSupported = Boolean(navigator && 'connection' in navigator);
    const connection = isSupported ? navigator.connection : null;
    const [isOnline, setIsOnline] = (0, react_1.useState)(true);
    const [saveData, setSaveData] = (0, react_1.useState)(undefined);
    const [offlineAt, setOfflineAt] = (0, react_1.useState)(undefined);
    const [onlineAt, setOnlineAt] = (0, react_1.useState)(undefined);
    const [downlink, setDownlink] = (0, react_1.useState)(undefined);
    const [downlinkMax, setDownlinkMax] = (0, react_1.useState)(undefined);
    const [rtt, setRtt] = (0, react_1.useState)(undefined);
    const [effectiveType, setEffectiveType] = (0, react_1.useState)(undefined);
    const [type, setType] = (0, react_1.useState)('unknown');
    const updateNetworkInformation = (0, react_1.useCallback)(() => {
        if (!navigator)
            return;
        setIsOnline(navigator.onLine);
        setOfflineAt(navigator.onLine ? undefined : Date.now());
        setOnlineAt(navigator.onLine ? Date.now() : undefined);
        if (connection) {
            setDownlink(connection.downlink);
            setDownlinkMax(connection.downlinkMax);
            setEffectiveType(connection.effectiveType);
            setRtt(connection.rtt);
            setSaveData(connection.saveData);
            setType(connection.type);
        }
    }, [navigator, connection]);
    (0, react_1.useEffect)(() => {
        if (!win)
            return;
        const handleOffline = () => {
            setIsOnline(false);
            setOfflineAt(Date.now());
        };
        const handleOnline = () => {
            setIsOnline(true);
            setOnlineAt(Date.now());
        };
        updateNetworkInformation();
        win.addEventListener('offline', handleOffline, { passive: true });
        win.addEventListener('online', handleOnline, { passive: true });
        if (connection) {
            connection.addEventListener('change', updateNetworkInformation, {
                passive: true,
            });
        }
        return () => {
            win.removeEventListener('offline', handleOffline);
            win.removeEventListener('online', handleOnline);
            if (connection) {
                connection.removeEventListener('change', updateNetworkInformation);
            }
        };
    }, [win, connection, updateNetworkInformation]);
    return {
        isSupported,
        isOnline,
        saveData,
        offlineAt,
        onlineAt,
        downlink,
        downlinkMax,
        effectiveType,
        rtt,
        type,
    };
}
exports.default = useNetwork;
