import { useState, useEffect, useCallback } from 'react'

interface CookieOptions {
  path?: string
  expires?: Date | number
  maxAge?: number
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  httpOnly?: boolean
}

interface UseCookiesOptions {
  doNotParse?: boolean
}

// For frontend only - removed server-specific code
interface BasicRequest {
  headers: {
    cookie?: string
  }
}

interface BasicResponse {
  setHeader(name: string, value: string | string[]): void
  getHeader(name: string): string | string[] | undefined
}

/**
 * Parse cookies from request headers
 */
export function parseCookies(req: BasicRequest): Record<string, string> {
  const cookies: Record<string, string> = {}
  const cookieHeader = req.headers.cookie

  if (!cookieHeader) return cookies

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=')
    const trimmedName = name.trim()
    const value = rest.join('=').trim()
    if (trimmedName && value) {
      cookies[trimmedName] = decodeURIComponent(value)
    }
  })

  return cookies
}

/**
 * Set cookie helper
 */
export function setCookie(
  res: BasicResponse,
  name: string,
  value: any,
  options: CookieOptions = {}
): void {
  const stringValue =
    typeof value === 'object' ? JSON.stringify(value) : String(value)
  const encodedValue = encodeURIComponent(stringValue)

  let cookieString = `${name}=${encodedValue}`

  if (options.path) cookieString += `; path=${options.path}`
  if (options.domain) cookieString += `; domain=${options.domain}`
  if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
  if (options.expires) {
    const expiresValue =
      typeof options.expires === 'number'
        ? new Date(options.expires).toUTCString()
        : options.expires.toUTCString()
    cookieString += `; expires=${expiresValue}`
  }
  if (options.secure) cookieString += '; secure'
  if (options.httpOnly) cookieString += '; httponly'
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`

  const existingCookies = res.getHeader('Set-Cookie') || []
  const cookies = Array.isArray(existingCookies)
    ? [...existingCookies, cookieString]
    : [existingCookies.toString(), cookieString]

  res.setHeader('Set-Cookie', cookies)
}

/**
 * Remove cookie helper
 */
export function removeCookie(
  res: BasicResponse,
  name: string,
  options: CookieOptions = {}
): void {
  setCookie(res, name, '', {
    ...options,
    expires: new Date(0),
  })
}

/**
 * React hook to manage cookies on the client side
 */
export function useCookies(
  dependencies?: string[] | null,
  { doNotParse = false }: UseCookiesOptions = {}
) {
  const [, setUpdateTrigger] = useState(0)

  const parseCookies = useCallback(() => {
    const cookies: Record<string, string> = {}
    if (typeof document === 'undefined') return cookies

    const cookiesStr = document.cookie
    if (!cookiesStr) return cookies

    cookiesStr.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=')
      const trimmedName = name.trim()
      const value = rest.join('=').trim()
      if (trimmedName && value) {
        cookies[trimmedName] = decodeURIComponent(value)
      }
    })

    return cookies
  }, [])

  const parseValue = useCallback(
    (value: string): any => {
      if (doNotParse) return value
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    },
    [doNotParse]
  )

  const get = useCallback(
    <T = any,>(name: string): T | undefined => {
      const cookies = parseCookies()
      const value = cookies[name]
      return value ? parseValue(value) : undefined
    },
    [parseCookies, parseValue]
  )

  const getAll = useCallback(() => {
    const cookies = parseCookies()
    const result: Record<string, any> = {}

    Object.entries(cookies).forEach(([name, value]) => {
      result[name] = parseValue(value)
    })

    return result
  }, [parseCookies, parseValue])

  const set = useCallback(
    (name: string, value: any, options: CookieOptions = {}): void => {
      if (typeof document === 'undefined') return

      const stringValue =
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      const encodedValue = encodeURIComponent(stringValue)

      let cookieString = `${name}=${encodedValue}`

      if (options.path) cookieString += `; path=${options.path}`
      if (options.domain) cookieString += `; domain=${options.domain}`
      if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
      if (options.expires) {
        const expiresValue =
          typeof options.expires === 'number'
            ? new Date(options.expires).toUTCString()
            : options.expires.toUTCString()
        cookieString += `; expires=${expiresValue}`
      }
      if (options.secure) cookieString += '; secure'
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`

      document.cookie = cookieString
      setUpdateTrigger((prev) => prev + 1)
    },
    []
  )

  const remove = useCallback(
    (name: string, options: CookieOptions = {}): void => {
      set(name, '', { ...options, expires: new Date(0) })
    },
    [set]
  )

  useEffect(() => {
    if (!dependencies || typeof document === 'undefined') return

    const interval = setInterval(() => {
      const currentCookies = parseCookies()
      const hasChanges = dependencies.some((name) => {
        const previousValue = get(name)
        const currentValue = currentCookies[name]
          ? parseValue(currentCookies[name])
          : undefined
        return JSON.stringify(previousValue) !== JSON.stringify(currentValue)
      })

      if (hasChanges) {
        setUpdateTrigger((prev) => prev + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [dependencies, get, parseCookies, parseValue])

  return {
    get,
    getAll,
    set,
    remove,
  }
}
