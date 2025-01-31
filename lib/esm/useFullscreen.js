import { useEffect, useRef, useState } from 'react';
import useSupported from './useSupported';
const eventHandlers = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'webkitendfullscreen',
    'mozfullscreenchange',
    'MSFullscreenChange',
];
export function useFullscreen(target, options = {}) {
    const { document: doc = typeof window !== 'undefined' ? window.document : undefined, autoExit = false, } = options;
    const [isFullscreen, setIsFullscreen] = useState(false);
    // Handle both RefObject and direct element
    const getTargetElement = () => {
        if (!target)
            return doc?.documentElement || null;
        if ('current' in target)
            return target.current;
        return target;
    };
    const targetRef = useRef(getTargetElement());
    const requestMethod = () => {
        const methods = [
            'requestFullscreen',
            'webkitRequestFullscreen',
            'webkitEnterFullscreen',
            'webkitEnterFullScreen',
            'webkitRequestFullScreen',
            'mozRequestFullScreen',
            'msRequestFullscreen',
        ];
        return methods.find((m) => (doc && m in doc) || (targetRef.current && m in targetRef.current));
    };
    const exitMethod = () => {
        const methods = [
            'exitFullscreen',
            'webkitExitFullscreen',
            'webkitExitFullScreen',
            'webkitCancelFullScreen',
            'mozCancelFullScreen',
            'msExitFullscreen',
        ];
        return methods.find((m) => (doc && m in doc) || (targetRef.current && m in targetRef.current));
    };
    const fullscreenEnabled = () => {
        const methods = [
            'fullScreen',
            'webkitIsFullScreen',
            'webkitDisplayingFullscreen',
            'mozFullScreen',
            'msFullscreenElement',
        ];
        return methods.find((m) => (doc && m in doc) || (targetRef.current && m in targetRef.current));
    };
    const fullscreenElementMethod = [
        'fullscreenElement',
        'webkitFullscreenElement',
        'mozFullScreenElement',
        'msFullscreenElement',
    ].find((m) => doc && m in doc);
    const isSupported = useSupported(() => {
        const target = targetRef.current;
        return Boolean(target && doc && requestMethod() && exitMethod() && fullscreenEnabled());
    });
    const isCurrentElementFullScreen = () => {
        if (fullscreenElementMethod && doc) {
            return (doc[fullscreenElementMethod] === targetRef.current);
        }
        return false;
    };
    const isElementFullScreen = () => {
        const fullscreenEnabledMethod = fullscreenEnabled();
        if (fullscreenEnabledMethod) {
            if (doc && fullscreenEnabledMethod in doc) {
                return Boolean(doc[fullscreenEnabledMethod]);
            }
            const target = targetRef.current;
            if (target && fullscreenEnabledMethod in target) {
                return Boolean(target[fullscreenEnabledMethod]);
            }
        }
        return false;
    };
    const exit = async () => {
        if (!isSupported || !isFullscreen)
            return;
        const exitMethodName = exitMethod();
        if (exitMethodName) {
            if (doc && exitMethodName in doc) {
                await doc[exitMethodName]();
            }
            else {
                const target = targetRef.current;
                if (target && exitMethodName in target) {
                    await target[exitMethodName]();
                }
            }
        }
        setIsFullscreen(false);
    };
    const enter = async () => {
        if (!isSupported || isFullscreen)
            return;
        if (isElementFullScreen()) {
            await exit();
        }
        const target = targetRef.current;
        const requestMethodName = requestMethod();
        if (requestMethodName && target && requestMethodName in target) {
            await target[requestMethodName]();
            setIsFullscreen(true);
        }
    };
    const toggle = async () => {
        await (isFullscreen ? exit() : enter());
    };
    useEffect(() => {
        targetRef.current = getTargetElement();
    }, [target]);
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isElementFullScreenValue = isElementFullScreen();
            if (!isElementFullScreenValue ||
                (isElementFullScreenValue && isCurrentElementFullScreen())) {
                setIsFullscreen(isElementFullScreenValue);
            }
        };
        const listenerOptions = { capture: false, passive: true };
        if (doc) {
            eventHandlers.forEach((event) => {
                doc.addEventListener(event, handleFullscreenChange, listenerOptions);
            });
        }
        const targetElement = targetRef.current;
        if (targetElement) {
            eventHandlers.forEach((event) => {
                targetElement.addEventListener(event, handleFullscreenChange, listenerOptions);
            });
        }
        return () => {
            if (doc) {
                eventHandlers.forEach((event) => {
                    doc.removeEventListener(event, handleFullscreenChange);
                });
            }
            if (targetElement) {
                eventHandlers.forEach((event) => {
                    targetElement.removeEventListener(event, handleFullscreenChange);
                });
            }
            if (autoExit) {
                exit();
            }
        };
    }, [doc, autoExit]);
    return {
        isSupported,
        isFullscreen,
        enter,
        exit,
        toggle,
    };
}
