"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToggle = useToggle;
const react_1 = require("react");
function useToggle(initialValue = false) {
    const [state, setState] = (0, react_1.useState)(initialValue);
    const toggle = (0, react_1.useCallback)(() => {
        setState((prevState) => !prevState);
    }, []);
    return [state, toggle];
}
