import React, { createContext, useState, useContext, useCallback, // <-- DITAMBAHKAN
useMemo // <-- DITAMBAHKAN
 } from 'react';
// 1. Membuat Context
const KeepAliveContext = createContext(null);
// 2. Custom Hook untuk akses yang aman dan mudah
export const useKeepAlive = () => {
    const context = useContext(KeepAliveContext);
    if (!context) {
        throw new Error('useKeepAlive harus digunakan di dalam KeepAlive');
    }
    return context;
};
// 3. Komponen Provider Utama
export function KeepAlive({ children }) {
    const [cache, setCache] = useState({});
    const [activeName, setActiveName] = useState('');
    // PERBAIKAN: Gunakan useCallback untuk mencegah pembuatan fungsi berulang kali
    const setCacheState = useCallback((item) => {
        // Hanya tambahkan ke cache jika belum ada
        if (!cache[item.name]) {
            setCache((prevCache) => ({
                ...prevCache,
                [item.name]: item,
            }));
        }
    }, [cache]); // Dependensi: fungsi ini akan dibuat ulang hanya jika 'cache' berubah
    // PERBAIKAN: Gunakan useMemo untuk memoize nilai context
    const contextValue = useMemo(() => ({
        cache,
        activeName,
        setCacheState,
        setActiveName,
    }), [cache, activeName, setCacheState]);
    return (React.createElement(KeepAliveContext.Provider, { value: contextValue },
        children,
        React.createElement(KeepAliveOutlet, null)));
}
// 4. Komponen Outlet Internal untuk merender cache
function KeepAliveOutlet() {
    const { cache, activeName } = useKeepAlive();
    return (React.createElement(React.Fragment, null, Object.values(cache).map(({ name, children }) => (React.createElement("div", { key: name, 
        // style di-set langsung untuk mengontrol visibilitas
        style: { display: name === activeName ? 'block' : 'none' } }, children)))));
}
