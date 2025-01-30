"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useObjectUrl = useObjectUrl;
const react_1 = require("react");
function useObjectUrl(object) {
    const [url, setUrl] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // Release the previous object URL if it exists
        if (url) {
            URL.revokeObjectURL(url);
        }
        // Create new object URL if object exists
        if (object) {
            const newUrl = URL.createObjectURL(object);
            setUrl(newUrl);
        }
        else {
            setUrl(null);
        }
        // Cleanup function to revoke object URL when component unmounts
        // or when object changes
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [object]); // Re-run effect when object changes
    return url;
}
