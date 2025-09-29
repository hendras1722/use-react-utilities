'use client';

import { useState, useMemo } from 'react';

export function useRef<T>(initialValue: T): { value: T } {
  const [value, setValue] = useState(initialValue);

  const ref = useMemo(() => ({
    get value() {
      return value;
    },
    set value(newValue: T) {
      setValue(newValue);
    },
  }), [value]);

  return ref;
}
