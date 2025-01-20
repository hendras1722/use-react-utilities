'use client'

import { useState, useEffect, useCallback } from 'react'

type NetworkType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'none'
  | 'wifi'
  | 'wimax'
  | 'other'
  | 'unknown'
type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined

interface NetworkState {
  isSupported: boolean
  /**
   * If the user is currently connected.
   */
  isOnline: boolean
  /**
   * The time since the user was last connected.
   */
  offlineAt: number | undefined
  /**
   * At this time, if the user is offline and reconnects
   */
  onlineAt: number | undefined
  /**
   * The download speed in Mbps.
   */
  downlink: number | undefined
  /**
   * The max reachable download speed in Mbps.
   */
  downlinkMax: number | undefined
  /**
   * The detected effective speed type.
   */
  effectiveType: NetworkEffectiveType
  /**
   * The estimated effective round-trip time of the current connection.
   */
  rtt: number | undefined
  /**
   * If the user activated data saver mode.
   */
  saveData: boolean | undefined
  /**
   * The detected connection/network type.
   */
  type: NetworkType
}

interface ConfigurableWindow {
  window?: Window | null
}

/**
 * React hook for monitoring network status.
 *
 * @param options Configuration options
 * @returns Network state object
 */
export default function useNetwork(
  options: ConfigurableWindow = {}
): NetworkState {
  const { window: win = typeof window !== 'undefined' ? window : null } =
    options
  const navigator = win?.navigator

  const isSupported = Boolean(navigator && 'connection' in navigator)
  const connection = isSupported ? (navigator as any).connection : null

  const [isOnline, setIsOnline] = useState(true)
  const [saveData, setSaveData] = useState<boolean | undefined>(undefined)
  const [offlineAt, setOfflineAt] = useState<number | undefined>(undefined)
  const [onlineAt, setOnlineAt] = useState<number | undefined>(undefined)
  const [downlink, setDownlink] = useState<number | undefined>(undefined)
  const [downlinkMax, setDownlinkMax] = useState<number | undefined>(undefined)
  const [rtt, setRtt] = useState<number | undefined>(undefined)
  const [effectiveType, setEffectiveType] =
    useState<NetworkEffectiveType>(undefined)
  const [type, setType] = useState<NetworkType>('unknown')

  const updateNetworkInformation = useCallback(() => {
    if (!navigator) return

    setIsOnline(navigator.onLine)
    setOfflineAt(navigator.onLine ? undefined : Date.now())
    setOnlineAt(navigator.onLine ? Date.now() : undefined)

    if (connection) {
      setDownlink(connection.downlink)
      setDownlinkMax(connection.downlinkMax)
      setEffectiveType(connection.effectiveType)
      setRtt(connection.rtt)
      setSaveData(connection.saveData)
      setType(connection.type)
    }
  }, [navigator, connection])

  useEffect(() => {
    if (!win) return

    const handleOffline = () => {
      setIsOnline(false)
      setOfflineAt(Date.now())
    }

    const handleOnline = () => {
      setIsOnline(true)
      setOnlineAt(Date.now())
    }

    updateNetworkInformation()

    win.addEventListener('offline', handleOffline, { passive: true })
    win.addEventListener('online', handleOnline, { passive: true })

    if (connection) {
      connection.addEventListener('change', updateNetworkInformation, {
        passive: true,
      })
    }

    return () => {
      win.removeEventListener('offline', handleOffline)
      win.removeEventListener('online', handleOnline)
      if (connection) {
        connection.removeEventListener('change', updateNetworkInformation)
      }
    }
  }, [win, connection, updateNetworkInformation])

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
  }
}

export type UseNetworkReturn = ReturnType<typeof useNetwork>
