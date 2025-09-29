import React, { type ReactNode } from "react";
interface SlotContentProps<T> {
    name?: string;
    children: ReactNode | ((props: T) => ReactNode);
}
export declare function Template<T>(_props: SlotContentProps<T>): null;
export declare function useSlots<T>(children: ReactNode): {
    slots: Record<string, React.ReactNode>;
    scopedSlots: Record<string, (props: T) => ReactNode>;
};
export {};
