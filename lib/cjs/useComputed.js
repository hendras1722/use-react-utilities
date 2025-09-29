'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComputed = useComputed;
const react_1 = require("react");
function useComputed(getter, setter) {
    const computedValue = (0, react_1.useMemo)(() => {
        try {
            return getter();
        }
        catch (error) {
            console.error('Error in computed getter:', error);
            return undefined;
        }
    }, [getter]);
    // If a setter is provided, create and return the WritableComputed object
    if (setter) {
        const setterFn = (0, react_1.useCallback)((newValue) => {
            setter(newValue);
        }, [setter]);
        return (0, react_1.useMemo)(() => ({
            get value() {
                return computedValue;
            },
            set value(newVal) {
                setterFn(newVal);
            },
        }), [computedValue, setterFn]);
    }
    // Otherwise, return the read-only Computed object
    return (0, react_1.useMemo)(() => ({
        get value() {
            return computedValue;
        },
    }), [computedValue]);
}
