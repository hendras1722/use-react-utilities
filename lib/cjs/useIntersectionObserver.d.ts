import { RefObject } from 'react';
interface ConfigurableWindow {
    window?: Window;
}
interface UseIntersectionObserverOptions extends ConfigurableWindow {
    /**
     * Start the IntersectionObserver immediately on creation
     *
     * @default true
     */
    immediate?: boolean;
    /**
     * The Element or Document whose bounds are used as the bounding box when testing for intersection.
     */
    root?: RefObject<Element> | null;
    /**
     * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
     */
    rootMargin?: string;
    /**
     * Either a single number or an array of numbers between 0.0 and 1.
     * @default 0
     */
    threshold?: number | number[];
}
interface UseIntersectionObserverReturn {
    isSupported: boolean;
    isActive: boolean;
    pause: () => void;
    resume: () => void;
    stop: () => void;
}
export declare function useIntersectionObserver(target: RefObject<Element>, callback: IntersectionObserverCallback, options?: UseIntersectionObserverOptions): UseIntersectionObserverReturn;
export {};
