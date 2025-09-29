import React from 'react';
interface ArrayMapProps<T> {
    of: T[];
    render: (item: T, index: number) => React.ReactNode;
}
export default function Each<T>({ of, render }: ArrayMapProps<T>): (string | number | bigint | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined>)[];
export {};
