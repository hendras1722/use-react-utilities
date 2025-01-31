"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentVisibility = useDocumentVisibility;
const react_1 = require("react");
function useDocumentVisibility(options = {}) {
    const document = options.document ?? window.document;
    // If no document is available, return 'visible' as default state
    if (!document) {
        return 'visible';
    }
    const [visibility, setVisibility] = (0, react_1.useState)(document ? document.visibilityState : 'visible');
    (0, react_1.useEffect)(() => {
        const handleVisibilityChange = () => {
            setVisibility(document.visibilityState);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange, {
            passive: true,
        });
        // Cleanup listener on unmount
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [document]);
    return visibility;
}
