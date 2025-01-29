"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowEvent = useWindowEvent;
exports.useDocumentEvent = useDocumentEvent;
exports.useElementEvent = useElementEvent;
const react_1 = require("react");
// Helper to handle array or single items
const toArray = (value) => {
    return Array.isArray(value) ? value : [value];
};
/**
 * React hook for managing event listeners with automatic cleanup
 *
 * @param target - DOM element, window, or document to attach listener to
 * @param event - Event name or array of event names
 * @param listener - Callback function(s) to handle the event
 * @param options - addEventListener options
 */
function useEventListener(target, event, listener, options) {
    // Use ref to store the listener to prevent unnecessary effect triggers
    const savedListener = (0, react_1.useRef)([]);
    // Convert listener to array and store in ref
    (0, react_1.useEffect)(() => {
        savedListener.current = toArray(listener);
    }, [listener]);
    (0, react_1.useEffect)(() => {
        // Skip if no target or no window in SSR
        if (!target)
            return;
        const targets = toArray(target);
        const events = toArray(event);
        // Register all event listeners
        const cleanups = targets.flatMap((currentTarget) => events.flatMap((currentEvent) => savedListener.current.map((currentListener) => {
            currentTarget?.addEventListener(currentEvent, currentListener, options);
            return () => {
                currentTarget?.removeEventListener(currentEvent, currentListener, options);
            };
        })));
        // Cleanup function to remove all listeners
        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, [target, event, options]); // savedListener.current is intentionally omitted
}
// Specialized hooks for common use cases
function useWindowEvent(event, listener, options) {
    return useEventListener(window, event, listener, options);
}
function useDocumentEvent(event, listener, options) {
    return useEventListener(document, event, listener, options);
}
function useElementEvent(element, event, listener, options) {
    return useEventListener(element, event, listener, options);
}
exports.default = useEventListener;
