import React from 'react';
interface VirtualListOptions {
    containerHeight: number;
    itemHeight?: number;
    overscan?: number;
}
export declare function useVirtualList<T>(items: T[], { containerHeight, itemHeight, overscan }: VirtualListOptions): {
    ref: React.RefObject<HTMLDivElement | null>;
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    scrollTo: (index: number) => void;
    items: T[];
    startIndex: number;
    styleContainer: {
        height: string;
        overscrollBehavior: string;
        overflow: string;
    };
    styleList: {
        paddingTop: string;
        paddingBottom: string;
    };
    topPadding: number;
    bottomPadding: number;
};
export {};
