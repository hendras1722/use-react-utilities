type Target = Window | Document | HTMLElement | EventTarget | null;
type EventMap = WindowEventMap | DocumentEventMap | HTMLElementEventMap;
type EventType<T> = string extends T ? keyof EventMap : keyof EventMap;
/**
 * React hook for managing event listeners with automatic cleanup
 *
 * @param target - DOM element, window, or document to attach listener to
 * @param event - Event name or array of event names
 * @param listener - Callback function(s) to handle the event
 * @param options - addEventListener options
 */
declare function useEventListener<T extends Target>(target: T | T[] | null | undefined, event: EventType<T> | EventType<T>[], listener: EventListener | EventListener[], options?: boolean | AddEventListenerOptions): void;
export declare function useWindowEvent<K extends keyof WindowEventMap>(event: K | K[], listener: ((this: Window, ev: WindowEventMap[K]) => any) | ((this: Window, ev: WindowEventMap[K]) => any)[], options?: boolean | AddEventListenerOptions): void;
export declare function useDocumentEvent<K extends keyof DocumentEventMap>(event: K | K[], listener: ((this: Document, ev: DocumentEventMap[K]) => any) | ((this: Document, ev: DocumentEventMap[K]) => any)[], options?: boolean | AddEventListenerOptions): void;
export declare function useElementEvent<K extends keyof HTMLElementEventMap>(element: HTMLElement | null | undefined, event: K | K[], listener: ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any) | ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any)[], options?: boolean | AddEventListenerOptions): void;
export default useEventListener;
