interface ArrayMapProps<T> {
    of: T[];
    render: (item: T, index: number) => React.ReactNode;
}
export default function ArrayMap<T>({ of, render }: ArrayMapProps<T>): (string | number | bigint | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null | undefined>)[];
export {};
