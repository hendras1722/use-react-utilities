type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined;
interface NetworkState {
    isSupported: boolean;
    /**
     * If the user is currently connected.
     */
    isOnline: boolean;
    /**
     * The time since the user was last connected.
     */
    offlineAt: number | undefined;
    /**
     * At this time, if the user is offline and reconnects
     */
    onlineAt: number | undefined;
    /**
     * The download speed in Mbps.
     */
    downlink: number | undefined;
    /**
     * The max reachable download speed in Mbps.
     */
    downlinkMax: number | undefined;
    /**
     * The detected effective speed type.
     */
    effectiveType: NetworkEffectiveType;
    /**
     * The estimated effective round-trip time of the current connection.
     */
    rtt: number | undefined;
    /**
     * If the user activated data saver mode.
     */
    saveData: boolean | undefined;
    /**
     * The detected connection/network type.
     */
    type: NetworkType;
}
interface ConfigurableWindow {
    window?: Window | null;
}
/**
 * React hook for monitoring network status.
 *
 * @param options Configuration options
 * @returns Network state object
 */
export default function useNetwork(options?: ConfigurableWindow): NetworkState;
export type UseNetworkReturn = ReturnType<typeof useNetwork>;
export {};
