"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCycleList = useCycleList;
const react_1 = require("react");
/**
 * Cycle through a list of items
 */
function useCycleList(items) {
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const state = items[currentIndex];
    const next = (0, react_1.useCallback)(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, [items.length]);
    const prev = (0, react_1.useCallback)(() => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? items.length - 1 : prevIndex - 1);
    }, [items.length]);
    return { state, next, prev };
}
