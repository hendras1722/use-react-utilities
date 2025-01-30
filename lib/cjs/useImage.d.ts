interface UseImageOptions {
    /** Address of the resource */
    src: string;
    /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
    srcset?: string;
    /** Image sizes for different page layouts */
    sizes?: string;
    /** Image alternative information */
    alt?: string;
    /** Image classes */
    className?: string;
    /** Image loading */
    loading?: HTMLImageElement['loading'];
    /** Image CORS settings */
    crossorigin?: string;
    /** Referrer policy for fetch */
    referrerPolicy?: HTMLImageElement['referrerPolicy'];
    /** Image width */
    width?: HTMLImageElement['width'];
    /** Image height */
    height?: HTMLImageElement['height'];
    /** Decoding hint */
    decoding?: HTMLImageElement['decoding'];
    /** Provides a hint of the relative priority to use when fetching the image */
    fetchPriority?: HTMLImageElement['fetchPriority'];
    /** Provides a hint of the importance of the image */
    ismap?: HTMLImageElement['isMap'];
    /** The partial URL (starting with #) of an image map associated with the element */
    usemap?: HTMLImageElement['useMap'];
}
interface UseImageReturn {
    loading: boolean;
    error: Error | null;
    image: HTMLImageElement | null;
}
export declare function useImage(options: UseImageOptions): UseImageReturn;
export {};
