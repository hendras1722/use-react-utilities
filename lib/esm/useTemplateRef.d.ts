import { type RefCallback } from 'react';
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
export declare function useTemplateRef<T = any>(): T & RefCallback<T>;
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
export declare function useTemplateRefs<T extends Record<string, any> = Record<string, HTMLElement>>(): T;
export default useTemplateRef;
