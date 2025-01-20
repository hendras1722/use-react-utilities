import { useEffect, useMemo, useState } from 'react'

export type Breakpoints<K extends string = string> = Record<K, number | string>

export interface UseBreakpointsOptions {
  /**
   * The query strategy to use for the generated shortcut methods
   * 'min-width' - .lg will be true when viewport is greater than or equal to lg breakpoint (mobile-first)
   * 'max-width' - .lg will be true when viewport is smaller than xl breakpoint (desktop-first)
   */
  strategy?: 'min-width' | 'max-width'
}

const pxValue = (value: string | number): number => {
  if (typeof value === 'number') return value
  return parseInt(value.replace('px', ''), 10)
}

const getValue = (
  breakpoints: Breakpoints,
  k: string,
  delta?: number
): string => {
  let v = breakpoints[k]
  if (delta != null) {
    v = typeof v === 'number' ? v + delta : pxValue(v) + delta
  }
  return typeof v === 'number' ? `${v}px` : v
}

export default function useBreakpoints<K extends string>(
  breakpoints: Breakpoints<K>,
  options: UseBreakpointsOptions = {}
) {
  const { strategy = 'min-width' } = options
  const [matches, setMatches] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const mediaQueries = Object.keys(breakpoints).reduce((acc, k) => {
      const query =
        strategy === 'min-width'
          ? `(min-width: ${getValue(breakpoints, k)})`
          : `(max-width: ${getValue(breakpoints, k)})`
      const mql = window.matchMedia(query)

      const handler = (e: MediaQueryListEvent) => {
        setMatches((prev) => ({
          ...prev,
          [k]: e.matches,
        }))
      }

      mql.addEventListener('change', handler)
      setMatches((prev) => ({
        ...prev,
        [k]: mql.matches,
      }))

      return {
        ...acc,
        [k]: { mql, handler },
      }
    }, {} as Record<string, { mql: MediaQueryList; handler: (e: MediaQueryListEvent) => void }>)

    // Cleanup
    return () => {
      Object.values(mediaQueries).forEach(({ mql, handler }) => {
        mql.removeEventListener('change', handler)
      })
    }
  }, [breakpoints, strategy])

  const api = useMemo(() => {
    const greaterOrEqual = (k: K) => matches[k] ?? false
    const smallerOrEqual = (k: K) => matches[k] ?? false

    const greater = (k: K) => {
      const query = `(min-width: ${getValue(breakpoints, k, 0.1)})`
      return window.matchMedia(query).matches
    }

    const smaller = (k: K) => {
      const query = `(max-width: ${getValue(breakpoints, k, -0.1)})`
      return window.matchMedia(query).matches
    }

    const between = (a: K, b: K) => {
      const query = `(min-width: ${getValue(
        breakpoints,
        a
      )}) and (max-width: ${getValue(breakpoints, b, -0.1)})`
      return window.matchMedia(query).matches
    }

    const current = () => {
      const points = (Object.keys(breakpoints) as K[])
        .map((k) => [k, matches[k], pxValue(getValue(breakpoints, k))] as const)
        .sort((a, b) => a[2] - b[2])
        .filter(([, matches]) => matches)
        .map(([k]) => k)
      return points
    }

    const active = () => {
      const currentPoints = current()
      return currentPoints.length === 0
        ? ''
        : currentPoints[strategy === 'min-width' ? currentPoints.length - 1 : 0]
    }

    // Create shortcut methods
    const shortcuts = Object.keys(breakpoints).reduce(
      (acc, k) => ({
        ...acc,
        [k]:
          strategy === 'min-width'
            ? greaterOrEqual(k as K)
            : smallerOrEqual(k as K),
      }),
      {}
    )

    return {
      ...shortcuts,
      greaterOrEqual,
      smallerOrEqual,
      greater,
      smaller,
      between,
      current,
      active,
    }
  }, [matches, breakpoints, strategy])

  return api
}

export type UseBreakpointsReturn<K extends string = string> = ReturnType<
  typeof useBreakpoints<K>
>
