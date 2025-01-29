type Handler = (event: PointerEvent | FocusEvent) => void;
interface UseClickOutsideOptions {
    /**
     * List of elements that should not trigger the event.
     */
    ignore?: (HTMLElement | string)[];
    /**
     * Use capturing phase for internal event listener.
     * @default true
     */
    capture?: boolean;
    /**
     * Run handler function if focus moves to an iframe.
     * @default false
     */
    detectIframe?: boolean;
}
/**
 * React hook to listen for clicks outside of an element.
 *
 * @param handler - Callback function to run when a click outside is detected
 * @param options - Configuration options
 * @returns ref to be attached to the target element
 */
export declare function useClickOutside<T extends HTMLElement = HTMLElement>(handler: Handler, options?: UseClickOutsideOptions): import("react").RefObject<T | null>;
export {};
