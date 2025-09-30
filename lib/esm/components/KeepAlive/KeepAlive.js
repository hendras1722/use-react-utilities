import { useEffect } from 'react';
import { useKeepAlive } from './Provider';
function KeepAlive({ name, active, children }) {
    const { setCacheState, setActiveName } = useKeepAlive();
    useEffect(() => {
        // Daftarkan komponen ke cache
        setCacheState({ name, children });
    }, [name, children, setCacheState]);
    useEffect(() => {
        // Set komponen ini sebagai yang aktif
        if (active) {
            setActiveName(name);
        }
    }, [active, name, setActiveName]);
    return null; // Rendering di-handle oleh Outlet
}
export default KeepAlive;
