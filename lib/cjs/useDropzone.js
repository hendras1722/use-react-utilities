"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useDropZone(target, options = {}) {
    const [isOverDropZone, setIsOverDropZone] = (0, react_1.useState)(false);
    const [files, setFiles] = (0, react_1.useState)(null);
    const counterRef = (0, react_1.useRef)(0);
    const isValidRef = (0, react_1.useRef)(true);
    const _options = typeof options === 'function' ? { onDrop: options } : options;
    const multiple = _options.multiple ?? true;
    const preventDefaultForUnhandled = _options.preventDefaultForUnhandled ?? false;
    (0, react_1.useEffect)(() => {
        const targetElement = target && 'current' in target ? target.current : target;
        if (!targetElement)
            return;
        const getFiles = (event) => {
            const list = Array.from(event.dataTransfer?.files ?? []);
            return list.length === 0 ? null : multiple ? list : [list[0]];
        };
        const checkDataTypes = (types) => {
            const dataTypes = _options.dataTypes;
            if (typeof dataTypes === 'function')
                return dataTypes(types);
            if (!dataTypes?.length)
                return true;
            if (types.length === 0)
                return false;
            return types.every((type) => dataTypes.some((allowedType) => type.includes(allowedType)));
        };
        const checkValidity = (items) => {
            const types = Array.from(items ?? []).map((item) => item.type);
            const dataTypesValid = checkDataTypes(types);
            const multipleFilesValid = multiple || items.length <= 1;
            return dataTypesValid && multipleFilesValid;
        };
        const isSafari = () => /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent) &&
            !('chrome' in window);
        const handleDragEvent = (event, eventType) => {
            const dataTransferItemList = event.dataTransfer?.items;
            isValidRef.current =
                (dataTransferItemList && checkValidity(dataTransferItemList)) ?? false;
            if (preventDefaultForUnhandled) {
                event.preventDefault();
            }
            if (!isSafari() && !isValidRef.current) {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = 'none';
                }
                return;
            }
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
            const currentFiles = getFiles(event);
            switch (eventType) {
                case 'enter':
                    counterRef.current += 1;
                    setIsOverDropZone(true);
                    _options.onEnter?.(null, event);
                    break;
                case 'over':
                    _options.onOver?.(null, event);
                    break;
                case 'leave':
                    counterRef.current -= 1;
                    if (counterRef.current === 0)
                        setIsOverDropZone(false);
                    _options.onLeave?.(null, event);
                    break;
                case 'drop':
                    counterRef.current = 0;
                    setIsOverDropZone(false);
                    if (isValidRef.current) {
                        setFiles(currentFiles);
                        _options.onDrop?.(currentFiles, event);
                    }
                    break;
            }
        };
        const onDragEnter = (event) => handleDragEvent(event, 'enter');
        const onDragOver = (event) => handleDragEvent(event, 'over');
        const onDragLeave = (event) => handleDragEvent(event, 'leave');
        const onDrop = (event) => handleDragEvent(event, 'drop');
        targetElement.addEventListener('dragenter', onDragEnter);
        targetElement.addEventListener('dragover', onDragOver);
        targetElement.addEventListener('dragleave', onDragLeave);
        targetElement.addEventListener('drop', onDrop);
        return () => {
            targetElement.removeEventListener('dragenter', onDragEnter);
            targetElement.removeEventListener('dragover', onDragOver);
            targetElement.removeEventListener('dragleave', onDragLeave);
            targetElement.removeEventListener('drop', onDrop);
        };
    }, [
        target,
        _options.onDrop,
        _options.onEnter,
        _options.onLeave,
        _options.onOver,
        _options.dataTypes,
        multiple,
        preventDefaultForUnhandled,
    ]);
    return {
        files,
        isOverDropZone,
    };
}
exports.default = useDropZone;
