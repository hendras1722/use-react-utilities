interface UseClipboardOptions {
    /**
     * Enable reading from clipboard
     * @default false
     */
    read?: boolean;
    /**
     * Default text to copy
     */
    source?: string;
    /**
     * Duration in ms before resetting copied state
     * @default 1500
     */
    copiedDuring?: number;
    /**
     * Whether to use legacy clipboard API as fallback
     * @default false
     */
    legacy?: boolean;
}
interface UseClipboardReturn {
    isSupported: boolean;
    text: string;
    copied: boolean;
    copy: (text?: string) => Promise<void>;
}
/**
 * React hook for clipboard operations
 */
declare const useClipboard: (options?: UseClipboardOptions) => UseClipboardReturn;
export default useClipboard;
