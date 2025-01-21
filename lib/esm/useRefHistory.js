import { useRef, useCallback, useState, useEffect } from 'react';
export default function useRefHistory(initialValue, options = {}) {
    const { deep = false, capacity, clone = deep, dump = (v) => v, parse = (v) => v, } = options;
    const [value, setValueState] = useState(initialValue);
    const [isTracking, setIsTracking] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(Date.now());
    const historyRef = useRef([]);
    const undoStack = useRef([]);
    const skipNextCommit = useRef(false);
    const isInitialized = useRef(true);
    const cloneValue = useCallback((val) => {
        if (!clone)
            return val;
        if (typeof clone === 'function')
            return clone(val);
        return JSON.parse(JSON.stringify(val));
    }, [clone]);
    const areValuesEqual = useCallback((a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    }, []);
    const commit = useCallback(() => {
        if (!isTracking || skipNextCommit.current || !isInitialized.current) {
            skipNextCommit.current = false;
            return;
        }
        const commitValue = dump(cloneValue(value));
        const timestamp = Date.now();
        // Check if this value is different from the last entry
        const lastEntry = historyRef.current[historyRef.current.length - 1];
        if (lastEntry && areValuesEqual(lastEntry.value, commitValue)) {
            return;
        }
        // Clear undo stack when new changes are made
        undoStack.current = [];
        // Add new state to history
        historyRef.current.push({ value: commitValue, timestamp });
        // Handle capacity limit
        if (capacity && historyRef.current.length > capacity) {
            historyRef.current = historyRef.current.slice(-capacity);
        }
        setLastUpdated(timestamp);
    }, [value, isTracking, capacity, dump, cloneValue, areValuesEqual]);
    useEffect(() => {
        console.log(isInitialized);
        if (!isInitialized.current) {
            isInitialized.current = true;
            // Initialize with first value
            historyRef.current = [
                {
                    value: dump(cloneValue(initialValue)),
                    timestamp: Date.now(),
                },
            ];
            return;
        }
        if (!skipNextCommit.current) {
            commit();
        }
    }, [value, commit, initialValue, dump, cloneValue]);
    const setValue = useCallback((newValue) => {
        setValueState(newValue);
    }, []);
    const batch = useCallback((fn) => {
        let canceled = false;
        const cancel = () => {
            canceled = true;
        };
        fn(cancel);
        if (!canceled) {
            commit();
        }
    }, [commit]);
    const undo = useCallback(() => {
        const previous = historyRef.current[historyRef.current.length - 1];
        if (!previous || historyRef.current.length === 1)
            return;
        // Store current value in undo stack
        const currentValue = dump(cloneValue(value));
        undoStack.current.push({
            value: currentValue,
            timestamp: Date.now(),
        });
        // Remove the last entry from history
        historyRef.current = historyRef.current.slice(0, -1);
        // Get the previous value from history
        const previousValue = historyRef.current[historyRef.current.length - 1];
        // Set the value to the previous state
        skipNextCommit.current = true;
        setValueState(parse(previousValue.value));
        setLastUpdated(Date.now());
    }, [value, dump, parse, cloneValue]);
    const redo = useCallback(() => {
        const next = undoStack.current[undoStack.current.length - 1];
        if (!next)
            return;
        // Remove from undo stack first
        undoStack.current = undoStack.current.slice(0, -1);
        historyRef.current.push(next);
        // Set the value from undo stack
        skipNextCommit.current = true;
        setValueState(parse(next.value));
        setLastUpdated(Date.now());
    }, [parse, value]);
    const pause = useCallback(() => {
        setIsTracking(false);
    }, []);
    const resume = useCallback((commitNow) => {
        setIsTracking(true);
        if (commitNow) {
            commit();
        }
    }, [commit]);
    const clear = useCallback(() => {
        historyRef.current = [
            {
                value: dump(cloneValue(value)),
                timestamp: Date.now(),
            },
        ];
        undoStack.current = [];
        setLastUpdated(Date.now());
    }, [value, dump, cloneValue]);
    const dispose = useCallback(() => {
        clear();
        setIsTracking(false);
    }, [clear]);
    return {
        value,
        setValue,
        history: historyRef.current,
        lastUpdated,
        isTracking,
        pause,
        resume,
        commit,
        batch,
        dispose,
        undo,
        redo,
        clear,
        canUndo: historyRef.current.length > 1,
        canRedo: undoStack.current.length > 0,
    };
}
