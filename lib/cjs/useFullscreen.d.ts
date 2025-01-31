interface UseFullscreenOptions {
    /**
     * Automatically exit fullscreen when component is unmounted
     *
     * @default false
     */
    autoExit?: boolean;
    document?: Document;
}
export declare function useFullscreen(target?: React.RefObject<HTMLElement> | HTMLElement | null, options?: UseFullscreenOptions): {
    isSupported: boolean;
    isFullscreen: boolean;
    enter: () => Promise<void>;
    exit: () => Promise<void>;
    toggle: () => Promise<void>;
};
export type UseFullscreenReturn = ReturnType<typeof useFullscreen>;
export {};
