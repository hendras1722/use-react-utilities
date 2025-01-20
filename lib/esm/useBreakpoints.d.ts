export type Breakpoints<K extends string = string> = Record<K, number | string>;
export interface UseBreakpointsOptions {
    /**
     * The query strategy to use for the generated shortcut methods
     * 'min-width' - .lg will be true when viewport is greater than or equal to lg breakpoint (mobile-first)
     * 'max-width' - .lg will be true when viewport is smaller than xl breakpoint (desktop-first)
     */
    strategy?: 'min-width' | 'max-width';
}
export default function useBreakpoints<K extends string>(breakpoints: Breakpoints<K>, options?: UseBreakpointsOptions): {
    greaterOrEqual: (k: K) => boolean;
    smallerOrEqual: (k: K) => boolean;
    greater: (k: K) => boolean;
    smaller: (k: K) => boolean;
    between: (a: K, b: K) => boolean;
    current: () => K[];
    active: () => "" | K;
};
export type UseBreakpointsReturn<K extends string = string> = ReturnType<typeof useBreakpoints<K>>;
