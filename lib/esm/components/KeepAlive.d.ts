import React, { ReactNode } from 'react';
interface KeepAliveProps {
    children: ReactNode;
    name: string;
    include?: string | string[];
    exclude?: string | string[];
    max?: number;
}
export declare const KeepAlive: React.FC<KeepAliveProps>;
export {};
