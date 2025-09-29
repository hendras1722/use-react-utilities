import { useEffect, useRef } from 'react';

type WatchCallback<T> = (newValue: T, oldValue: T | undefined) => void;
type WatchEffectCallback = () => void | (() => void);

interface UseWatchOptions {
  immediate?: boolean;
  deep?: boolean;
}

interface UseWatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync';
}

export function useWatch<T>(
  source: T | WatchEffectCallback,
  callback?: WatchCallback<T> | UseWatchOptions | UseWatchEffectOptions,
  options?: UseWatchOptions
): void {
  // Determine if the hook is being used as `watch` or `watchEffect`
  const isWatchEffect = typeof source === 'function';

  if (isWatchEffect) {
    const effect = source as WatchEffectCallback;
    const effectOptions = (callback as UseWatchEffectOptions) || {};

    if (effectOptions.flush === 'pre' || effectOptions.flush === 'sync') {
      console.warn(`The 'flush' option is not directly supported by React's useEffect and will be ignored.`);
    }

    useEffect(() => {
      const cleanup = effect();
      return cleanup;
    }, [effect]);

    return;
  }

  // Use case: Vue's `watch`
  const valueToWatch = source as T;
  const watchCallback = callback as WatchCallback<T>;
  const watchOptions = options || {};
  const { immediate = false, deep = false } = watchOptions;

  const previousValue = useRef<T | undefined>(undefined);
  const isFirstRun = useRef(true);

  // Helper function to handle deep comparison
  const isEqual = (a: any, b: any): boolean => {
    if (!deep) return Object.is(a, b);
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    // A more robust deep equality check is recommended for production.
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return Object.is(a, b);
    }
  };

  useEffect(() => {
    if (isFirstRun.current) {
      if (immediate) {
        watchCallback(valueToWatch, previousValue.current);
      }
      isFirstRun.current = false;
      previousValue.current = valueToWatch;
      return;
    }

    if (!isEqual(valueToWatch, previousValue.current)) {
      watchCallback(valueToWatch, previousValue.current);
    }

    previousValue.current = valueToWatch;
  }, [valueToWatch, watchCallback, immediate, deep]);
}
