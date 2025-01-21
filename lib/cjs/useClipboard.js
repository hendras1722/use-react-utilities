"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * React hook for clipboard operations
 */
const useClipboard = (options = {}) => {
    const { read = false, source, copiedDuring = 1500, legacy = false } = options;
    const [text, setText] = (0, react_1.useState)('');
    const [copied, setCopied] = (0, react_1.useState)(false);
    // Check if clipboard API is supported
    const isSupported = (0, react_1.useMemo)(() => {
        return (typeof navigator !== 'undefined' && ('clipboard' in navigator || legacy));
    }, [legacy]);
    // Legacy copy function
    const legacyCopy = (0, react_1.useCallback)((value) => {
        const ta = document.createElement('textarea');
        ta.value = value ?? '';
        ta.style.position = 'absolute';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }, []);
    // Legacy read function
    const legacyRead = (0, react_1.useCallback)(() => {
        return document?.getSelection?.()?.toString() ?? '';
    }, []);
    // Copy function
    const copy = (0, react_1.useCallback)(async (value = source ?? '') => {
        if (isSupported && value != null) {
            try {
                if ('clipboard' in navigator) {
                    await navigator.clipboard.writeText(value);
                }
                else if (legacy) {
                    legacyCopy(value);
                }
                setText(value);
                setCopied(true);
                // Reset copied state after delay
                setTimeout(() => {
                    setCopied(false);
                }, copiedDuring);
            }
            catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }, [isSupported, source, copiedDuring, legacy, legacyCopy]);
    // Handle clipboard read events
    (0, react_1.useEffect)(() => {
        if (!isSupported || !read)
            return;
        const updateText = async () => {
            try {
                if ('clipboard' in navigator) {
                    const value = await navigator.clipboard.readText();
                    setText(value);
                }
                else {
                    setText(legacyRead());
                }
            }
            catch (err) {
                console.error('Failed to read clipboard:', err);
            }
        };
        const events = ['copy', 'cut'];
        events.forEach((event) => {
            document.addEventListener(event, updateText, { passive: true });
        });
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, updateText);
            });
        };
    }, [isSupported, read, legacyRead]);
    return {
        isSupported,
        text,
        copied,
        copy,
    };
};
exports.default = useClipboard;
