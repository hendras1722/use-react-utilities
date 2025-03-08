type ArrayStateActions<T> = {
    add: (item: T) => void;
    remove: (index: number) => void;
    clear: () => void;
    replace: (index: number, item: T | ((item: T) => T)) => void;
};
export declare const useArrayState: <T>(initialItems?: T[]) => [T[], ArrayStateActions<T>];
export default useArrayState;
