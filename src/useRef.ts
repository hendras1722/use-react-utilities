import { useState, useMemo } from 'react';

export function ref<T>(initialValue: T): { value: T } {
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
