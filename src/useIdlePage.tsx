import { useState, useEffect, useRef, useCallback } from 'react'

interface IdleDetectorOptions {
  idleTimeout?: number
  syncInterval?: number
  storageKey?: string
  onIdleChange?: (isIdle: boolean) => void
}

interface TabData {
  lastUpdate: number
  idle: boolean
}

interface AllTabs {
  [tabId: string]: TabData | undefined
}

export function useIdlePage(options: IdleDetectorOptions = {}) {
  // Configuration with defaults
  const config = {
    idleTimeout: options.idleTimeout ?? 0,
    syncInterval: options.syncInterval ?? 2000,
    storageKey: options.storageKey ?? 'vueMultiTabIdleState',
    onIdleChange: options.onIdleChange ?? undefined,
  }

  // Reactive state (using useState)
  const [isIdle, setIsIdle] = useState(false) // Current tab idle state
  const [isSystemIdle, setIsSystemIdle] = useState(true) // All tabs idle state
  const tabId = useRef(Math.random().toString(36).slice(2, 15)).current // Generate tab ID only once
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Timers (using useRef to persist across renders)
  const idleCheckTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  )

  // Get data from storage (memoized with useCallback)
  const getStorageData = useCallback(() => {
    try {
      const storedData = localStorage.getItem(config.storageKey)
      return storedData ? (JSON.parse(storedData) as AllTabs) : {} // Type assertion here
    } catch {
      return {} as AllTabs // Type assertion here
    }
  }, [config.storageKey])

  // Update storage with new data (memoized with useCallback)
  const updateStorage = useCallback(
    (data: AllTabs) => {
      // Explicit type for data
      localStorage.setItem(config.storageKey, JSON.stringify(data))
    },
    [config.storageKey]
  )

  // Check if all tabs are idle (memoized with useCallback)
  const checkGlobalIdleState = useCallback(() => {
    const allTabs = getStorageData()
    const now = Date.now()
    let allIdle = true
    let hasActiveTabs = false

    // Clean up stale tabs
    const cleanedTabs: AllTabs = { ...allTabs }
    for (const id of Object.keys(cleanedTabs)) {
      if (
        cleanedTabs[id] &&
        now - cleanedTabs[id]!.lastUpdate > config.syncInterval * 5
      ) {
        //  Fix: Using non-null assertion ! and checking for undefined
        delete cleanedTabs[id]
      }
    }

    // Update storage if we removed any stale tabs
    if (Object.keys(cleanedTabs).length !== Object.keys(allTabs).length) {
      updateStorage(cleanedTabs)
    }

    // Check if any tab is active
    for (const tab of Object.values(cleanedTabs)) {
      if (tab && tab.idle === false) allIdle = false //  Type check and guard

      hasActiveTabs = true
    }

    // If no tabs are registered, consider system idle
    if (!hasActiveTabs) allIdle = true

    setIsSystemIdle(allIdle)
    return allIdle
  }, [config.syncInterval, getStorageData, updateStorage, setIsSystemIdle])

  // Update this tab's status in storage (memoized with useCallback)
  const updateTabStatus = useCallback(() => {
    const allTabs = getStorageData()

    const newTabStatus: TabData = {
      lastUpdate: Date.now(),
      idle: isIdle,
    }

    allTabs[tabId] = newTabStatus

    updateStorage(allTabs)
    checkGlobalIdleState()
  }, [getStorageData, isIdle, tabId, updateStorage, checkGlobalIdleState])

  // Remove this tab from storage on cleanup (memoized with useCallback)
  const removeTabFromStorage = useCallback(() => {
    const allTabs = getStorageData()
    if (Object.prototype.hasOwnProperty.call(allTabs, tabId)) {
      // Changed to prototype method
      delete allTabs[tabId]
    }

    updateStorage(allTabs)
  }, [getStorageData, tabId, updateStorage])

  // Handle user activity (memoized with useCallback)
  const handleUserActivity = useCallback(() => {
    const wasIdle = isIdle
    setLastActivity(Date.now())

    if (wasIdle) {
      setIsIdle(false)
      updateTabStatus()
    }
  }, [isIdle, setLastActivity, updateTabStatus, setIsIdle])

  // Event handler for visibility change (memoized with useCallback)
  const handleVisibilityChange = useCallback(() => {
    updateTabStatus()
  }, [updateTabStatus])

  // Event handler for storage events from other tabs (memoized with useCallback)
  const handleStorageChange = useCallback(
    (event: StorageEvent) => {
      // Explicit type for event
      if (event.key === config.storageKey) checkGlobalIdleState()
    },
    [checkGlobalIdleState, config.storageKey]
  )

  // Start the idle detection system (memoized with useCallback)
  const startIdleDetection = useCallback(() => {
    // Initialize storage if needed
    if (!localStorage.getItem(config.storageKey)) updateStorage({})

    // Register activity event listeners
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ]

    for (const event of activityEvents) {
      window.addEventListener(event, handleUserActivity)
    }

    // Register visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Register storage event listener
    window.addEventListener('storage', handleStorageChange)

    // Start timer to check idle status
    idleCheckTimer.current = setInterval(() => {
      const now = Date.now()

      // Check if this tab is idle
      if (!isIdle && now - lastActivity > config.idleTimeout) {
        setIsIdle(true)
        updateTabStatus()
      }

      // Periodically update even if nothing changed
      // This helps with sync across tabs
      updateTabStatus()
    }, config.syncInterval)

    // Immediately register this tab
    updateTabStatus()
  }, [
    config.storageKey,
    config.idleTimeout,
    config.syncInterval,
    handleUserActivity,
    handleVisibilityChange,
    handleStorageChange,
    isIdle,
    lastActivity,
    updateStorage,
    updateTabStatus,
    setIsIdle,
  ])

  // Stop and clean up the idle detection (memoized with useCallback)
  const stopIdleDetection = useCallback(() => {
    if (idleCheckTimer.current) clearInterval(idleCheckTimer.current)

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ]

    for (const event of activityEvents) {
      window.removeEventListener(event, handleUserActivity)
    }

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('storage', handleStorageChange)

    removeTabFromStorage()
  }, [
    handleUserActivity,
    handleVisibilityChange,
    handleStorageChange,
    removeTabFromStorage,
  ])

  // Effect for idle state changes
  useEffect(() => {
    if (typeof config.onIdleChange === 'function') {
      config.onIdleChange(isSystemIdle)
    }
  }, [isSystemIdle, config.onIdleChange])

  // Setup on component mount
  useEffect(() => {
    startIdleDetection()

    // Clean up on component unmount
    return () => {
      stopIdleDetection()
    }
  }, [startIdleDetection, stopIdleDetection])

  // Return reactive state and methods
  return {
    isIdle, // Current tab idle state
    isSystemIdle, // Overall system idle state (all tabs)
    resetActivity: handleUserActivity, // Manually reset activity timer
    checkIdle: checkGlobalIdleState, // Manually check idle state
  }
}
