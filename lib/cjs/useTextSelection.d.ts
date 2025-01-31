interface UseTextSelectionReturn {
    text: string;
    rects: DOMRect[];
    ranges: Range[];
    selection: Selection | null;
}
export declare function useTextSelection(): UseTextSelectionReturn;
export {};
