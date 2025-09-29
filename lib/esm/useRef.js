'use client';
import { useState, useMemo } from 'react';
export function useRef(initialValue) {
    const [value, setValue] = useState(initialValue);
    const ref = useMemo(() => ({
        get value() {
            return value;
        },
        set value(newValue) {
            setValue(newValue);
        },
    }), [value]);
    return ref;
}
