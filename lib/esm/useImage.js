import { useState, useEffect } from 'react';
function loadImage(options) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const { src, srcset, sizes, className, loading, crossorigin, referrerPolicy, width, height, decoding, fetchPriority, ismap, usemap, } = options;
        img.src = src;
        if (srcset)
            img.srcset = srcset;
        if (sizes)
            img.sizes = sizes;
        if (className)
            img.className = className;
        if (loading)
            img.loading = loading;
        if (crossorigin)
            img.crossOrigin = crossorigin;
        if (referrerPolicy)
            img.referrerPolicy = referrerPolicy;
        if (width)
            img.width = width;
        if (height)
            img.height = height;
        if (decoding)
            img.decoding = decoding;
        if (fetchPriority)
            img.fetchPriority = fetchPriority;
        if (ismap)
            img.isMap = ismap;
        if (usemap)
            img.useMap = usemap;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
}
export function useImage(options) {
    const [state, setState] = useState({
        loading: true,
        error: null,
        image: null,
    });
    useEffect(() => {
        let isMounted = true;
        setState((prev) => ({ ...prev, loading: true }));
        loadImage(options)
            .then((img) => {
            if (isMounted) {
                setState({
                    loading: false,
                    error: null,
                    image: img,
                });
            }
        })
            .catch((error) => {
            if (isMounted) {
                setState({
                    loading: false,
                    error: error instanceof Error
                        ? error
                        : new Error('Failed to load image'),
                    image: null,
                });
            }
        });
        return () => {
            isMounted = false;
        };
    }, [
        options.src,
        options.srcset,
        options.sizes,
        options.className,
        options.loading,
        options.crossorigin,
        options.referrerPolicy,
        options.width,
        options.height,
        options.decoding,
        options.fetchPriority,
        options.ismap,
        options.usemap,
    ]);
    return state;
}
