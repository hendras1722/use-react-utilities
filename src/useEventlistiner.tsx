import { useEffect, useRef } from 'react'

type Target = Window | Document | HTMLElement | EventTarget | null
type EventMap = WindowEventMap | DocumentEventMap | HTMLElementEventMap
type EventType<T> = string extends T ? keyof EventMap : keyof EventMap

// Helper to handle array or single items
const toArray = <T,>(value: T | T[]): T[] => {
  return Array.isArray(value) ? value : [value]
}

/**
 * React hook for managing event listeners with automatic cleanup
 *
 * @param target - DOM element, window, or document to attach listener to
 * @param event - Event name or array of event names
 * @param listener - Callback function(s) to handle the event
 * @param options - addEventListener options
 */
function useEventListener<T extends Target>(
  target: T | T[] | null | undefined,
  event: EventType<T> | EventType<T>[],
  listener: EventListener | EventListener[],
  options?: boolean | AddEventListenerOptions
) {
  // Use ref to store the listener to prevent unnecessary effect triggers
  const savedListener = useRef<EventListener[]>([])

  // Convert listener to array and store in ref
  useEffect(() => {
    savedListener.current = toArray(listener)
  }, [listener])

  useEffect(() => {
    // Skip if no target or no window in SSR
    if (!target) return

    const targets = toArray(target)
    const events = toArray(event)

    // Register all event listeners
    const cleanups = targets.flatMap((currentTarget) =>
      events.flatMap((currentEvent) =>
        savedListener.current.map((currentListener) => {
          currentTarget?.addEventListener(
            currentEvent,
            currentListener,
            options
          )

          return () => {
            currentTarget?.removeEventListener(
              currentEvent,
              currentListener,
              options
            )
          }
        })
      )
    )

    // Cleanup function to remove all listeners
    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [target, event, options]) // savedListener.current is intentionally omitted
}

// Specialized hooks for common use cases
export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K | K[],
  listener:
    | ((this: Window, ev: WindowEventMap[K]) => any)
    | ((this: Window, ev: WindowEventMap[K]) => any)[],
  options?: boolean | AddEventListenerOptions
) {
  return useEventListener(
    window,
    event as EventType<HTMLElement> | EventType<HTMLElement>[],
    listener as EventListener | EventListener[],
    options
  )
}

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  event: K | K[],
  listener:
    | ((this: Document, ev: DocumentEventMap[K]) => any)
    | ((this: Document, ev: DocumentEventMap[K]) => any)[],
  options?: boolean | AddEventListenerOptions
) {
  return useEventListener(
    document,
    event as EventType<HTMLElement> | EventType<HTMLElement>[],
    listener as EventListener | EventListener[],
    options
  )
}

export function useElementEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null | undefined,
  event: K | K[],
  listener:
    | ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any)
    | ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any)[],
  options?: boolean | AddEventListenerOptions
) {
  return useEventListener(
    element,
    event as EventType<HTMLElement> | EventType<HTMLElement>[],
    listener as EventListener | EventListener[],
    options
  )
}

export default useEventListener
