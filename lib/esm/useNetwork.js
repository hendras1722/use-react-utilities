'use client';
import { useState, useEffect, useCallback } from 'react';
/**
 * React hook for monitoring network status.
 *
 * @param options Configuration options
 * @returns Network state object
 */
export default function useNetwork(options = {}) {
    const { window: win = typeof window !== 'undefined' ? window : null } = options;
    const navigator = win?.navigator;
    const isSupported = Boolean(navigator && 'connection' in navigator);
    const connection = isSupported ? navigator.connection : null;
    const [isOnline, setIsOnline] = useState(true);
    const [saveData, setSaveData] = useState(undefined);
    const [offlineAt, setOfflineAt] = useState(undefined);
    const [onlineAt, setOnlineAt] = useState(undefined);
    const [downlink, setDownlink] = useState(undefined);
    const [downlinkMax, setDownlinkMax] = useState(undefined);
    const [rtt, setRtt] = useState(undefined);
    const [effectiveType, setEffectiveType] = useState(undefined);
    const [type, setType] = useState('unknown');
    const updateNetworkInformation = useCallback(() => {
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
    useEffect(() => {
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
