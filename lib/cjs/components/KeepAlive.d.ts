import React, { type ReactNode } from "react";
export declare const useActivated: (callback: () => void) => void;
interface KeepAliveProps {
    children: ReactNode;
    name: string;
    include?: string | string[];
    exclude?: string | string[];
    max?: number;
}
export declare const KeepAlive: React.FC<KeepAliveProps>;
export {};
