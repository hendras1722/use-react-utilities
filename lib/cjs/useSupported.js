"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSupported;
const react_1 = require("react");
function useSupported(callback) {
    const [isSupported, setIsSupported] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Check support when component mounts
        setIsSupported(Boolean(callback()));
    }, [callback]);
    return isSupported;
}
