import { useCallback, useState } from 'react';
/**
 * Cycle through a list of items
 */
export function useCycleList(items) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const state = items[currentIndex];
    const next = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, [items.length]);
    const prev = useCallback(() => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? items.length - 1 : prevIndex - 1);
    }, [items.length]);
    return { state, next, prev };
}
