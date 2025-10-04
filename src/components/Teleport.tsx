import React from 'react';
import { createPortal } from 'react-dom';
import { ref } from '../useRef';
import { onMounted, onUnmounted } from '../useLifeCycle';
import { useWatch } from '../useWatchEffect';

export function Teleport({ to, children }: Readonly<{ to: string | Element; children: React.ReactNode }>) {
  const mounted = ref(false)
  const target = ref<Element | null>(null)

  onMounted(() => {
    mounted.value = true
  })

  onUnmounted(() => {
    mounted.value = false
  })

  useWatch([to, mounted.value], ([_toValue, mountedValue]) => {
    if (!mountedValue) return;

    let targetElement: Element | null = null;

    if (typeof to === 'string') {
      if (to.startsWith('#')) {
        targetElement = document.getElementById(to.slice(1));
      } else if (to === 'body') {
        targetElement = document.body;
      } else {
        targetElement = document.querySelector(to);
      }
    } else {
      targetElement = to;
    }

    if (!targetElement) {
      console.warn(`Teleport target "${to}" tidak ditemukan`);
      return;
    }

    target.value = targetElement;
  })


  if (!mounted.value || !target.value) return null;

  return createPortal(children, target.value);
}