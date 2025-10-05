"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplateRef = useTemplateRef;
exports.useTemplateRefs = useTemplateRefs;
const react_1 = require("react");
const useRef_1 = require("./useRef");
/**
 * useTemplateRef - Mirip Vue 3 templateRef
 * Bisa langsung digunakan sebagai ref dan akses property tanpa .current
 *
 * @example
 * const input = useTemplateRef<HTMLInputElement>();
 *
 * <input ref={input} />
 *
 * // Akses langsung tanpa .current
 * input?.focus();
 * input?.value;
 */
function useTemplateRef() {
    const elementRef = (0, react_1.useRef)(null);
    // const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const refCallback = (0, react_1.useCallback)((el) => {
        if (elementRef.current !== el) {
            elementRef.current = el;
            // forceUpdate();
        }
    }, []);
    const proxyRef = (0, react_1.useRef)(null);
    if (!proxyRef.current) {
        // Buat proxy sekali saja
        proxyRef.current = new Proxy(refCallback, {
            get(_, prop) {
                const element = elementRef.current;
                if (element && typeof element === 'object' && prop in element) {
                    const value = element[prop];
                    return typeof value === 'function' ? value.bind(element) : value;
                }
                return undefined;
            },
            apply(_, _thisArg, args) {
                return refCallback.apply(null, args);
            }
        });
    }
    return proxyRef.current;
}
/**
 * useTemplateRefs - Multiple refs dengan Proxy
 *
 * @example
 * const $ = useTemplateRefs<{
 *   input: HTMLInputElement;
 *   button: HTMLButtonElement;
 * }>();
 *
 * <input ref={$.input} />
 * <button ref={$.button} />
 *
 * // Akses langsung
 * $.input?.focus();
 * $.button?.click();
 */
function useTemplateRefs() {
    const elementsRef = (0, react_1.useRef)(new Map());
    const callbacksRef = (0, react_1.useRef)(new Map());
    const proxiesRef = (0, react_1.useRef)(new Map());
    const [, forceUpdate] = (0, react_1.useReducer)((x) => x + 1, 0);
    const updateElement = (0, react_1.useCallback)((key, element) => {
        const prev = elementsRef.current.get(key);
        if (prev !== element) {
            if (element === null) {
                elementsRef.current.delete(key);
            }
            else {
                elementsRef.current.set(key, element);
            }
            forceUpdate();
        }
    }, []);
    const mainProxyRef = (0, useRef_1.ref)({});
    if (!mainProxyRef.value) {
        // Buat main proxy sekali saja
        mainProxyRef.value = new Proxy({}, {
            get(_, refName) {
                // Reuse proxy untuk ref name yang sama
                if (!proxiesRef.current.has(refName)) {
                    // Reuse callback yang sama untuk ref name yang sama
                    if (!callbacksRef.current.has(refName)) {
                        const refCallback = (el) => {
                            updateElement(refName, el);
                        };
                        callbacksRef.current.set(refName, refCallback);
                    }
                    const refCallback = callbacksRef.current.get(refName);
                    // Buat proxy untuk ref ini dan simpan
                    const refProxy = new Proxy(refCallback, {
                        get(_, prop) {
                            const element = elementsRef.current.get(refName);
                            if (element && prop in element) {
                                const value = element[prop];
                                return typeof value === 'function' ? value.bind(element) : value;
                            }
                            return undefined;
                        },
                        apply(_target, _thisArg, args) {
                            return refCallback.apply(null, args);
                        }
                    });
                    proxiesRef.current.set(refName, refProxy);
                }
                return proxiesRef.current.get(refName);
            }
        });
    }
    return mainProxyRef.value;
}
exports.default = useTemplateRef;
