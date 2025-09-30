import { useMemo, useCallback } from 'react';
export function useComputed(getter, setter) {
    const computedValue = useMemo(() => {
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
        const setterFn = useCallback((newValue) => {
            setter(newValue);
        }, [setter]);
        return useMemo(() => ({
            get value() {
                return computedValue;
            },
            set value(newVal) {
                setterFn(newVal);
            },
        }), [computedValue, setterFn]);
    }
    // Otherwise, return the read-only Computed object
    return useMemo(() => ({
        get value() {
            return computedValue;
        },
    }), [computedValue]);
}
