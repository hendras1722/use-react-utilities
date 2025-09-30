import React, { ReactNode } from 'react';
interface CacheItem {
    name: string;
    children: ReactNode;
}
interface KeepAliveContextType {
    cache: Record<string, CacheItem>;
    activeName: string;
    setCacheState: (item: CacheItem) => void;
    setActiveName: (name: string) => void;
}
export declare const useKeepAlive: () => KeepAliveContextType;
export declare function KeepAlive({ children }: Readonly<{
    children: ReactNode;
}>): React.JSX.Element;
export {};
