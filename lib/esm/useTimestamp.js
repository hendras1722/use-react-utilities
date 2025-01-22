'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
const timestamp = () => Date.now();
function useTimestamp(options = {}) {
    const { controls: exposeControls = false, offset = 0, immediate = true, interval = 'requestAnimationFrame', callback, } = options;
    const [ts, setTs] = useState(timestamp() + offset);
    const [isActive, setIsActive] = useState(immediate);
    const rafId = useRef(null);
    const intervalId = useRef(null);
    const update = useCallback(() => {
        const newTs = timestamp() + offset;
        setTs(newTs);
        callback?.(newTs);
    }, [offset, callback]);
    const pause = useCallback(() => {
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
    const resume = useCallback(() => {
        setIsActive(true);
    }, []);
    useEffect(() => {
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
export default useTimestamp;
