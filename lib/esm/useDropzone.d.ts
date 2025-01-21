interface UseDropZoneOptions {
    /**
     * Allowed data types, if not set, all data types are allowed.
     * Also can be a function to check the data types.
     */
    dataTypes?: string[] | ((types: readonly string[]) => boolean);
    onDrop?: (files: File[] | null, event: DragEvent) => void;
    onEnter?: (files: File[] | null, event: DragEvent) => void;
    onLeave?: (files: File[] | null, event: DragEvent) => void;
    onOver?: (files: File[] | null, event: DragEvent) => void;
    /**
     * Allow multiple files to be dropped. Defaults to true.
     */
    multiple?: boolean;
    /**
     * Prevent default behavior for unhandled events. Defaults to false.
     */
    preventDefaultForUnhandled?: boolean;
}
export default function useDropZone(target: React.RefObject<HTMLElement> | HTMLElement | null, options?: UseDropZoneOptions | UseDropZoneOptions['onDrop']): {
    files: File[] | null;
    isOverDropZone: boolean;
};
export {};
