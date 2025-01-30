import { useState, useEffect } from 'react'

interface UseImageOptions {
  /** Address of the resource */
  src: string
  /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
  srcset?: string
  /** Image sizes for different page layouts */
  sizes?: string
  /** Image alternative information */
  alt?: string
  /** Image classes */
  className?: string
  /** Image loading */
  loading?: HTMLImageElement['loading']
  /** Image CORS settings */
  crossorigin?: string
  /** Referrer policy for fetch */
  referrerPolicy?: HTMLImageElement['referrerPolicy']
  /** Image width */
  width?: HTMLImageElement['width']
  /** Image height */
  height?: HTMLImageElement['height']
  /** Decoding hint */
  decoding?: HTMLImageElement['decoding']
  /** Provides a hint of the relative priority to use when fetching the image */
  fetchPriority?: HTMLImageElement['fetchPriority']
  /** Provides a hint of the importance of the image */
  ismap?: HTMLImageElement['isMap']
  /** The partial URL (starting with #) of an image map associated with the element */
  usemap?: HTMLImageElement['useMap']
}

interface UseImageReturn {
  loading: boolean
  error: Error | null
  image: HTMLImageElement | null
}

function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    const {
      src,
      srcset,
      sizes,
      className,
      loading,
      crossorigin,
      referrerPolicy,
      width,
      height,
      decoding,
      fetchPriority,
      ismap,
      usemap,
    } = options

    img.src = src
    if (srcset) img.srcset = srcset
    if (sizes) img.sizes = sizes
    if (className) img.className = className
    if (loading) img.loading = loading
    if (crossorigin) img.crossOrigin = crossorigin
    if (referrerPolicy) img.referrerPolicy = referrerPolicy
    if (width) img.width = width
    if (height) img.height = height
    if (decoding) img.decoding = decoding
    if (fetchPriority) img.fetchPriority = fetchPriority
    if (ismap) img.isMap = ismap
    if (usemap) img.useMap = usemap

    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
  })
}

export function useImage(options: UseImageOptions): UseImageReturn {
  const [state, setState] = useState<UseImageReturn>({
    loading: true,
    error: null,
    image: null,
  })

  useEffect(() => {
    let isMounted = true

    setState((prev) => ({ ...prev, loading: true }))

    loadImage(options)
      .then((img) => {
        if (isMounted) {
          setState({
            loading: false,
            error: null,
            image: img,
          })
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error('Failed to load image'),
            image: null,
          })
        }
      })

    return () => {
      isMounted = false
    }
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
  ])

  return state
}
