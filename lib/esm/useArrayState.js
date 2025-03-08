import { useState, useCallback } from 'react';
export const useArrayState = (initialItems = []) => {
    const [items, setItems] = useState(initialItems);
    const add = useCallback((item) => {
        setItems((prevItems) => [...prevItems, item]);
    }, [setItems]);
    const replace = useCallback((index, item) => {
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems[index] = item;
            return newItems;
        });
    }, [setItems]);
    const remove = useCallback((index) => {
        setItems((prevItems) => {
            const newItems = [...prevItems];
            newItems.splice(index, 1);
            return newItems;
        });
    }, [setItems]);
    const clear = useCallback(() => {
        setItems([]);
    }, [setItems]);
    return [items, { add, remove, clear, replace }];
};
export default useArrayState;
