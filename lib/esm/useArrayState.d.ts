type ArrayStateActions<T> = {
    add: (item: T) => void;
    remove: (index: number) => void;
    clear: () => void;
};
declare const useArrayState: <T>(initialItems?: T[]) => [T[], ArrayStateActions<T>];
export { useArrayState };
