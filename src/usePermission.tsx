import { useState, useEffect, useCallback, useMemo } from 'react'

type DescriptorNamePolyfill =
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker'
  | 'local-fonts'

type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | { name: DescriptorNamePolyfill }

interface UsePermissionOptions<Controls extends boolean = false> {
  navigator?: Navigator
  controls?: Controls
}

interface UsePermissionReturnWithControls {
  state: PermissionState | undefined
  isSupported: boolean
  query: () => Promise<PermissionStatus | undefined>
}

export default function usePermission<Controls extends boolean = false>(
  permissionDesc:
    | GeneralPermissionDescriptor
    | GeneralPermissionDescriptor['name'],
  options?: UsePermissionOptions<Controls>
): Controls extends true
  ? UsePermissionReturnWithControls
  : PermissionState | undefined {
  const { controls = false as Controls, navigator = window.navigator } =
    options || {}

  // Check if Permissions API is supported
  const isSupported = useMemo(
    () => !!(navigator && 'permissions' in navigator),
    [navigator]
  )

  // State management
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>()
  const [state, setState] = useState<PermissionState>()

  // Normalize permission descriptor
  const desc = useMemo(
    () =>
      typeof permissionDesc === 'string'
        ? ({ name: permissionDesc } as PermissionDescriptor)
        : (permissionDesc as PermissionDescriptor),
    [permissionDesc]
  )

  // Update state based on permission status
  const update = useCallback(() => {
    setState(permissionStatus?.state ?? 'prompt')
  }, [permissionStatus])

  // Query permission
  const query = useCallback(async () => {
    if (!isSupported) return

    if (!permissionStatus) {
      try {
        const status = await navigator.permissions.query(desc)
        setPermissionStatus(status)
        update()
        return status
      } catch {
        setPermissionStatus(undefined)
        return undefined
      }
    }

    return permissionStatus
  }, [isSupported, navigator, desc, update])

  // Handle permission status changes
  useEffect(() => {
    if (!permissionStatus) return

    const handleChange = () => update()
    permissionStatus.addEventListener('change', handleChange)

    return () => {
      permissionStatus.removeEventListener('change', handleChange)
    }
  }, [permissionStatus, update])

  // Initial query
  useEffect(() => {
    query()
  }, [query])

  // Return based on controls flag
  return (
    controls ? { state, isSupported, query } : state
  ) as Controls extends true
    ? UsePermissionReturnWithControls
    : PermissionState | undefined
}
