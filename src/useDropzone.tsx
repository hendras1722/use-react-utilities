import { useState, useRef, useEffect } from 'react'

interface UseDropZoneOptions {
  /**
   * Allowed data types, if not set, all data types are allowed.
   * Also can be a function to check the data types.
   */
  dataTypes?: string[] | ((types: readonly string[]) => boolean)
  onDrop?: (files: File[] | null, event: DragEvent) => void
  onEnter?: (files: File[] | null, event: DragEvent) => void
  onLeave?: (files: File[] | null, event: DragEvent) => void
  onOver?: (files: File[] | null, event: DragEvent) => void
  /**
   * Allow multiple files to be dropped. Defaults to true.
   */
  multiple?: boolean
  /**
   * Prevent default behavior for unhandled events. Defaults to false.
   */
  preventDefaultForUnhandled?: boolean
}

export default function useDropZone(
  target: React.RefObject<HTMLElement> | HTMLElement | null,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {}
) {
  const [isOverDropZone, setIsOverDropZone] = useState(false)
  const [files, setFiles] = useState<File[] | null>(null)
  const counterRef = useRef(0)
  const isValidRef = useRef(true)

  const _options = typeof options === 'function' ? { onDrop: options } : options
  const multiple = _options.multiple ?? true
  const preventDefaultForUnhandled =
    _options.preventDefaultForUnhandled ?? false

  useEffect(() => {
    const targetElement =
      target && 'current' in target ? target.current : target
    if (!targetElement) return

    const getFiles = (event: DragEvent) => {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return list.length === 0 ? null : multiple ? list : [list[0]]
    }

    const checkDataTypes = (types: string[]) => {
      const dataTypes = _options.dataTypes

      if (typeof dataTypes === 'function') return dataTypes(types)

      if (!dataTypes?.length) return true

      if (types.length === 0) return false

      return types.every((type) =>
        dataTypes.some((allowedType) => type.includes(allowedType))
      )
    }

    const checkValidity = (items: DataTransferItemList) => {
      const types = Array.from(items ?? []).map((item) => item.type)
      const dataTypesValid = checkDataTypes(types)
      const multipleFilesValid = multiple || items.length <= 1
      return dataTypesValid && multipleFilesValid
    }

    const isSafari = () =>
      /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      !('chrome' in window)

    const handleDragEvent = (
      event: DragEvent,
      eventType: 'enter' | 'over' | 'leave' | 'drop'
    ) => {
      const dataTransferItemList = event.dataTransfer?.items
      isValidRef.current =
        (dataTransferItemList && checkValidity(dataTransferItemList)) ?? false

      if (preventDefaultForUnhandled) {
        event.preventDefault()
      }

      if (!isSafari() && !isValidRef.current) {
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'none'
        }
        return
      }

      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }

      const currentFiles = getFiles(event)

      switch (eventType) {
        case 'enter':
          counterRef.current += 1
          setIsOverDropZone(true)
          _options.onEnter?.(null, event)
          break
        case 'over':
          _options.onOver?.(null, event)
          break
        case 'leave':
          counterRef.current -= 1
          if (counterRef.current === 0) setIsOverDropZone(false)
          _options.onLeave?.(null, event)
          break
        case 'drop':
          counterRef.current = 0
          setIsOverDropZone(false)
          if (isValidRef.current) {
            setFiles(currentFiles)
            _options.onDrop?.(currentFiles, event)
          }
          break
      }
    }

    const onDragEnter = (event: DragEvent) => handleDragEvent(event, 'enter')
    const onDragOver = (event: DragEvent) => handleDragEvent(event, 'over')
    const onDragLeave = (event: DragEvent) => handleDragEvent(event, 'leave')
    const onDrop = (event: DragEvent) => handleDragEvent(event, 'drop')

    targetElement.addEventListener('dragenter', onDragEnter)
    targetElement.addEventListener('dragover', onDragOver)
    targetElement.addEventListener('dragleave', onDragLeave)
    targetElement.addEventListener('drop', onDrop)

    return () => {
      targetElement.removeEventListener('dragenter', onDragEnter)
      targetElement.removeEventListener('dragover', onDragOver)
      targetElement.removeEventListener('dragleave', onDragLeave)
      targetElement.removeEventListener('drop', onDrop)
    }
  }, [
    target,
    _options.onDrop,
    _options.onEnter,
    _options.onLeave,
    _options.onOver,
    _options.dataTypes,
    multiple,
    preventDefaultForUnhandled,
  ])

  return {
    files,
    isOverDropZone,
  }
}
