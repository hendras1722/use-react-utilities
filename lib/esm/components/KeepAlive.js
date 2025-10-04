import React, { createContext, useContext, useEffect, } from "react";
import { useWatch } from "../useWatchEffect";
import { ref } from "../useRef";
const KeepAliveContext = createContext(null);
export const useActivated = (callback) => {
    const ctx = useContext(KeepAliveContext);
    const wasActive = ref(false);
    useWatch([ctx, callback], () => {
        if (!ctx)
            return;
        if (ctx?.active && !wasActive.value) {
            callback();
        }
        wasActive.value = ctx.active;
    }, {
        immediate: true
    });
};
export const KeepAlive = ({ children, name, include, exclude, max = 10, }) => {
    const cacheRef = ref(new Map());
    const activeKey = ref('');
    const shouldCache = (cacheName) => {
        if (include) {
            const includeList = Array.isArray(include) ? include : [include];
            return includeList.includes(cacheName);
        }
        if (exclude) {
            const excludeList = Array.isArray(exclude) ? exclude : [exclude];
            return !excludeList.includes(cacheName);
        }
        return true;
    };
    useEffect(() => {
        if (!name || !shouldCache(name))
            return;
        if (!cacheRef.value.has(name)) {
            if (cacheRef.value.size >= max) {
                const firstKey = cacheRef.value.keys().next().value;
                if (firstKey) {
                    cacheRef.value.delete(firstKey);
                }
            }
        }
        cacheRef.value.set(name, children);
        activeKey.value = name;
    }, [name, children, max, include, exclude]);
    if (!name || !shouldCache(name)) {
        return React.createElement(React.Fragment, null, children);
    }
    return (React.createElement(React.Fragment, null, Array.from(cacheRef.value.entries()).map(([key, component]) => {
        const isActive = activeKey.value === key;
        return (React.createElement("div", { key: key, style: { display: isActive ? "block" : "none" } },
            React.createElement(KeepAliveContext.Provider, { value: { active: isActive } }, component)));
    })));
};
