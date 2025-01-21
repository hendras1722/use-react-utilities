'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useStorage;
const react_1 = require("react");
const StorageSerializers = {
    boolean: {
        read: (v) => v === 'true',
        write: (v) => String(v),
    },
    object: {
        read: (v) => JSON.parse(v),
        write: (v) => JSON.stringify(v),
    },
    number: {
        read: (v) => Number.parseFloat(v),
        write: (v) => String(v),
    },
    any: {
        read: (v) => v,
        write: (v) => String(v),
    },
    string: {
        read: (v) => v,
        write: (v) => String(v),
    },
    map: {
        read: (v) => new Map(JSON.parse(v)),
        write: (v) => JSON.stringify(Array.from(v.entries())),
    },
    set: {
        read: (v) => new Set(JSON.parse(v)),
        write: (v) => JSON.stringify(Array.from(v)),
    },
    date: {
        read: (v) => new Date(v),
        write: (v) => v.toISOString(),
    },
};
function guessSerializerType(value) {
    if (value === null)
        return 'any';
    if (value instanceof Map)
        return 'map';
    if (value instanceof Set)
        return 'set';
    if (value instanceof Date)
        return 'date';
    if (typeof value === 'boolean')
        return 'boolean';
    if (typeof value === 'string')
        return 'string';
    if (typeof value === 'number')
        return 'number';
    if (typeof value === 'object')
        return 'object';
    return 'any';
}
function useStorage(key, defaultValue, storage = window.localStorage, options = {}) {
    const { listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, onError = (e) => console.error(e), } = options;
    const type = guessSerializerType(defaultValue);
    const serializer = options.serializer ?? StorageSerializers[type];
    // Use state to store the current value
    const [state, setState] = (0, react_1.useState)(() => {
        try {
            const rawValue = storage.getItem(key);
            if (rawValue == null) {
                if (writeDefaults && defaultValue != null) {
                    storage.setItem(key, serializer.write(defaultValue));
                }
                return defaultValue;
            }
            const value = serializer.read(rawValue);
            if (mergeDefaults) {
                if (typeof mergeDefaults === 'function') {
                    return mergeDefaults(value, defaultValue);
                }
                else if (type === 'object' && !Array.isArray(value)) {
                    return { ...defaultValue, ...value };
                }
            }
            return value;
        }
        catch (e) {
            onError(e);
            return defaultValue;
        }
    });
    // Keep track of the current key for storage event handling
    const currentKey = (0, react_1.useRef)(key);
    (0, react_1.useEffect)(() => {
        currentKey.current = key;
    }, [key]);
    // Storage event handler for cross-tab synchronization
    const handleStorageChange = (0, react_1.useCallback)((event) => {
        if (event.key === currentKey.current && event.storageArea === storage) {
            try {
                const newValue = event.newValue
                    ? serializer.read(event.newValue)
                    : defaultValue;
                setState(newValue);
            }
            catch (e) {
                onError(e);
            }
        }
    }, [defaultValue, storage, serializer, onError]);
    // Set up storage event listener
    (0, react_1.useEffect)(() => {
        if (listenToStorageChanges) {
            window.addEventListener('storage', handleStorageChange);
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }
        return undefined;
    }, [listenToStorageChanges, handleStorageChange]);
    // Update function that handles both direct values and updater functions
    const updateValue = (0, react_1.useCallback)((newValue) => {
        try {
            setState((prev) => {
                const value = typeof newValue === 'function'
                    ? newValue(prev)
                    : newValue;
                storage.setItem(key, serializer.write(value));
                return value;
            });
        }
        catch (e) {
            onError(e);
        }
    }, [key, storage, serializer, onError]);
    // Remove function to clear the storage
    const removeItem = (0, react_1.useCallback)(() => {
        try {
            storage.removeItem(key);
            setState(defaultValue);
        }
        catch (e) {
            onError(e);
        }
    }, [key, storage, defaultValue, onError]);
    return [state, updateValue, removeItem];
}
