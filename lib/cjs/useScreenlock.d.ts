/// <reference types="react" />
type ElementType = HTMLElement | SVGElement | null | undefined;
export default function useScrollLock(elementRef: React.RefObject<ElementType> | ElementType, initialState?: boolean): readonly [boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>];
export {};
