"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useRefHistory;
const react_1 = require("react");
function useRefHistory(initialValue, options = {}) {
    const { deep = false, capacity, clone = deep, dump = (v) => v, parse = (v) => v, } = options;
    const [value, setValueState] = (0, react_1.useState)(initialValue);
    const [isTracking, setIsTracking] = (0, react_1.useState)(true);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(Date.now());
    const historyRef = (0, react_1.useRef)([]);
    const undoStack = (0, react_1.useRef)([]);
    const skipNextCommit = (0, react_1.useRef)(false);
    const isInitialized = (0, react_1.useRef)(true);
    const cloneValue = (0, react_1.useCallback)((val) => {
        if (!clone)
            return val;
        if (typeof clone === 'function')
            return clone(val);
        return JSON.parse(JSON.stringify(val));
    }, [clone]);
    const areValuesEqual = (0, react_1.useCallback)((a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    }, []);
    const commit = (0, react_1.useCallback)(() => {
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
    (0, react_1.useEffect)(() => {
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
    const setValue = (0, react_1.useCallback)((newValue) => {
        setValueState(newValue);
    }, []);
    const batch = (0, react_1.useCallback)((fn) => {
        let canceled = false;
        const cancel = () => {
            canceled = true;
        };
        fn(cancel);
        if (!canceled) {
            commit();
        }
    }, [commit]);
    const undo = (0, react_1.useCallback)(() => {
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
    const redo = (0, react_1.useCallback)(() => {
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
    const pause = (0, react_1.useCallback)(() => {
        setIsTracking(false);
    }, []);
    const resume = (0, react_1.useCallback)((commitNow) => {
        setIsTracking(true);
        if (commitNow) {
            commit();
        }
    }, [commit]);
    const clear = (0, react_1.useCallback)(() => {
        historyRef.current = [
            {
                value: dump(cloneValue(value)),
                timestamp: Date.now(),
            },
        ];
        undoStack.current = [];
        setLastUpdated(Date.now());
    }, [value, dump, cloneValue]);
    const dispose = (0, react_1.useCallback)(() => {
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
