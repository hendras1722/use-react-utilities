import { useCallback, useReducer, useRef, type RefCallback } from 'react';
import { ref } from './useRef';

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
export function useTemplateRef<T = any>() {
  const elementRef = useRef<T | null>(null);
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const refCallback: RefCallback<T> = useCallback((el: T | null) => {
    if (elementRef.current !== el) {
      elementRef.current = el;
      // forceUpdate();
    }
  }, []);

  const proxyRef = useRef<any>(null);

  if (!proxyRef.current) {
    // Buat proxy sekali saja
    proxyRef.current = new Proxy(refCallback, {
      get(_, prop) {
        const element = elementRef.current;
        if (element && typeof element === 'object' && prop in element) {
          const value = (element as any)[prop];
          return typeof value === 'function' ? value.bind(element) : value;
        }
        return undefined;
      },
      apply(_, _thisArg, args) {
        return refCallback.apply(null, args as [T | null]);
      }
    });
  }

  return proxyRef.current as T & RefCallback<T>;
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
export function useTemplateRefs<T extends Record<string, any> = Record<string, HTMLElement>>() {
  const elementsRef = useRef<Map<string, any>>(new Map());
  const callbacksRef = useRef<Map<string, RefCallback<any>>>(new Map());
  const proxiesRef = useRef<Map<string, any>>(new Map());
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const updateElement = useCallback((key: string, element: any) => {
    const prev = elementsRef.current.get(key);
    if (prev !== element) {
      if (element === null) {
        elementsRef.current.delete(key);
      } else {
        elementsRef.current.set(key, element);
      }
      forceUpdate();
    }
  }, []);

  const mainProxyRef = ref<T>({} as T);

  if (!mainProxyRef.value) {
    // Buat main proxy sekali saja
    mainProxyRef.value = new Proxy({} as T, {
      get(_, refName: string) {
        // Reuse proxy untuk ref name yang sama
        if (!proxiesRef.current.has(refName)) {
          // Reuse callback yang sama untuk ref name yang sama
          if (!callbacksRef.current.has(refName)) {
            const refCallback: RefCallback<any> = (el) => {
              updateElement(refName, el);
            };
            callbacksRef.current.set(refName, refCallback);
          }

          const refCallback = callbacksRef.current.get(refName)!;

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
              return refCallback.apply(null, args as [any]);
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

export default useTemplateRef;