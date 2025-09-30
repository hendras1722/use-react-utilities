import React, { useState, useRef, useEffect } from 'react';
export const KeepAlive = ({ children, name, include, exclude, max = 10 }) => {
    const cacheRef = useRef(new Map());
    const [activeKey, setActiveKey] = useState('');
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
        if (!name || !shouldCache(name)) {
            return;
        }
        // Tambah ke cache jika belum ada
        if (!cacheRef.current.has(name)) {
            if (cacheRef.current.size >= max) {
                const firstKey = cacheRef.current.keys().next().value;
                if (firstKey) {
                    cacheRef.current.delete(firstKey);
                }
            }
            cacheRef.current.set(name, children);
        }
        else {
            // Update children jika sudah ada
            cacheRef.current.set(name, children);
        }
        setActiveKey(name);
    }, [name, max, include, exclude]);
    // Jika tidak perlu cache, render langsung
    if (!name || !shouldCache(name)) {
        return React.createElement(React.Fragment, null, children);
    }
    return (React.createElement(React.Fragment, null, Array.from(cacheRef.current.entries()).map(([key, component]) => (React.createElement("div", { key: key, style: { display: activeKey === key ? 'block' : 'none' } }, component)))));
};
