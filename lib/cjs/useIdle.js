'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useIdle;
const react_1 = require("react");
const defaultEvents = [
    'mousemove',
    'mousedown',
    'resize',
    'keydown',
    'touchstart',
    'wheel',
];
const ONE_MINUTE = 60_000;
function useIdle(timeout = ONE_MINUTE) {
    const [idle, setIdle] = (0, react_1.useState)(false);
    const [lastActive, setLastActive] = (0, react_1.useState)(Date.now());
    const timerRef = (0, react_1.useRef)(null);
    // const lastEventTime = useRef(Date.now())
    const startTimer = (0, react_1.useCallback)(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setIdle(true);
        }, timeout);
    }, [timeout]);
    const handleActivity = (0, react_1.useCallback)(() => {
        const now = Date.now();
        setLastActive(now);
        setIdle(false);
        startTimer();
    }, [startTimer]);
    const reset = (0, react_1.useCallback)(() => {
        handleActivity();
    }, [handleActivity]);
    (0, react_1.useEffect)(() => {
        // Start initial timer
        startTimer();
        // Setup event listeners
        const onVisibility = () => {
            if (!document.hidden) {
                handleActivity();
            }
        };
        const options = { passive: true };
        // Add all event listeners
        defaultEvents.forEach((event) => {
            window.addEventListener(event, handleActivity, options);
        });
        document.addEventListener('visibilitychange', onVisibility);
        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            defaultEvents.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [handleActivity, startTimer]);
    return { idle, lastActive, reset };
}
