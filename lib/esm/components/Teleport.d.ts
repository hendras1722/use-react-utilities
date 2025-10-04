import React from 'react';
export declare function Teleport({ to, children }: Readonly<{
    to: string | Element;
    children: React.ReactNode;
}>): React.ReactPortal | null;
