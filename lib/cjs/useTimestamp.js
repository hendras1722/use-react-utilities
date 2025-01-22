'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const timestamp = () => Date.now();
function useTimestamp(options = {}) {
    const { controls: exposeControls = false, offset = 0, immediate = true, interval = 'requestAnimationFrame', callback, } = options;
    const [ts, setTs] = (0, react_1.useState)(timestamp() + offset);
    const [isActive, setIsActive] = (0, react_1.useState)(immediate);
    const rafId = (0, react_1.useRef)(null);
    const intervalId = (0, react_1.useRef)(null);
    const update = (0, react_1.useCallback)(() => {
        const newTs = timestamp() + offset;
        setTs(newTs);
        callback?.(newTs);
    }, [offset, callback]);
    const pause = (0, react_1.useCallback)(() => {
        setIsActive(false);
        if (interval === 'requestAnimationFrame') {
            if (rafId.current)
                cancelAnimationFrame(rafId.current);
        }
        else {
            if (intervalId.current)
                clearInterval(intervalId.current);
        }
    }, [interval]);
    const resume = (0, react_1.useCallback)(() => {
        setIsActive(true);
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isActive)
            return;
        if (interval === 'requestAnimationFrame') {
            const tick = () => {
                update();
                rafId.current = requestAnimationFrame(tick);
            };
            rafId.current = requestAnimationFrame(tick);
            return () => {
                if (rafId.current)
                    cancelAnimationFrame(rafId.current);
            };
        }
        else {
            update(); // Initial update
            intervalId.current = setInterval(update, interval);
            return () => {
                if (intervalId.current)
                    clearInterval(intervalId.current);
            };
        }
    }, [interval, isActive, update]);
    if (exposeControls) {
        return {
            timestamp: ts,
            pause,
            resume,
            isActive,
        };
    }
    return ts;
}
exports.default = useTimestamp;
