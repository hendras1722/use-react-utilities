"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTextSelection = useTextSelection;
const react_1 = require("react");
function getRangesFromSelection(selection) {
    const rangeCount = selection.rangeCount ?? 0;
    return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i));
}
function useTextSelection() {
    const [text, setText] = (0, react_1.useState)('');
    const [rects, setRects] = (0, react_1.useState)([]);
    const [ranges, setRanges] = (0, react_1.useState)([]);
    const [selection, setSelection] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleSelectionChange = () => {
            const newSelection = window.getSelection();
            setSelection(newSelection);
            setText(newSelection?.toString() ?? '');
            if (newSelection) {
                const newRanges = getRangesFromSelection(newSelection);
                setRanges(newRanges);
                setRects(newRanges.map((range) => range.getBoundingClientRect()));
            }
            else {
                setRanges([]);
                setRects([]);
            }
        };
        // Initial selection check
        handleSelectionChange();
        // Add event listener
        document.addEventListener('selectionchange', handleSelectionChange);
        // Cleanup
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);
    return {
        text,
        rects,
        ranges,
        selection,
    };
}
