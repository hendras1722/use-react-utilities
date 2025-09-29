'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRef = useRef;
const react_1 = require("react");
function useRef(initialValue) {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    const ref = (0, react_1.useMemo)(() => ({
        get value() {
            return value;
        },
        set value(newValue) {
            setValue(newValue);
        },
    }), [value]);
    return ref;
}
