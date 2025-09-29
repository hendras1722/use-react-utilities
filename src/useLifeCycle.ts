import { useEffect, useLayoutEffect } from 'react';
import { ref } from './useRef';

export function onMounted(callback: () => void) {
  useEffect(() => {
    callback();
  }, []);
}

export function onUnmounted(callback: () => void) {
  useEffect(() => {
    return () => {
      callback();
    };
  }, []);
}

export function onUpdated(callback: () => void) {
  const hasMounted = ref(false);
  useEffect(() => {
    if (hasMounted.value) {
      callback();
    } else {
      hasMounted.value = true;
    }
  });
}

export function onBeforeUpdate(callback: () => void) {
  const isFirstRender = ref(true);
  useLayoutEffect(() => {
    if (isFirstRender.value) {
      isFirstRender.value = false;
      return;
    }
    callback();
  });
}

export function onBeforeUnmount(callback: () => void) {
  const callbackRef = ref(callback);

  useEffect(() => {
    return () => {
      callbackRef.value();
    };
  }, []);
}

export function onBeforeMount(callback: () => void) {
  const hasRun = ref(false);
  if (!hasRun.value) {
    callback();
    hasRun.value = true
  }
}
