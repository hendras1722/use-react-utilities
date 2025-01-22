'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
const defaultEvents = [
    'mousemove',
    'mousedown',
    'resize',
    'keydown',
    'touchstart',
    'wheel',
];
const ONE_MINUTE = 60_000;
export default function useIdle(timeout = ONE_MINUTE) {
    const [idle, setIdle] = useState(false);
    const [lastActive, setLastActive] = useState(Date.now());
    const timerRef = useRef(null);
    // const lastEventTime = useRef(Date.now())
    const startTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setIdle(true);
        }, timeout);
    }, [timeout]);
    const handleActivity = useCallback(() => {
        const now = Date.now();
        setLastActive(now);
        setIdle(false);
        startTimer();
    }, [startTimer]);
    const reset = useCallback(() => {
        handleActivity();
    }, [handleActivity]);
    useEffect(() => {
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
