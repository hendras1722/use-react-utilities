import React, {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { ref, useWatch } from 'use-react-utilities'

interface KeepAliveContextValue {
  active: boolean;
}

const KeepAliveContext = createContext<KeepAliveContextValue | null>(null);

export const useActivated = (callback: () => void) => {
  const ctx = useContext(KeepAliveContext);
  const wasActive = ref(false)

  useWatch([ctx, callback], () => {
    if (!ctx) return;

    if (ctx?.active && !wasActive.value) {
      callback();
    }

    wasActive.value = ctx.active;
  }, {
    immediate: true
  })
};

interface KeepAliveProps {
  children: ReactNode;
  name: string;
  include?: string | string[];
  exclude?: string | string[];
  max?: number;
}

export const KeepAlive: React.FC<KeepAliveProps> = ({
  children,
  name,
  include,
  exclude,
  max = 10,
}) => {
  const cacheRef = ref<Map<string, ReactNode>>(new Map())
  const activeKey = ref('')

  const shouldCache = (cacheName: string): boolean => {
    if (include) {
      const includeList = Array.isArray(include) ? include : [include];
      return includeList.includes(cacheName);
    }
    if (exclude) {
      const excludeList = Array.isArray(exclude) ? exclude : [exclude];
      return !excludeList.includes(cacheName);
    }
    return true;
  };

  useEffect(() => {
    if (!name || !shouldCache(name)) return;

    if (!cacheRef.value.has(name)) {
      if (cacheRef.value.size >= max) {
        const firstKey = cacheRef.value.keys().next().value;
        if (firstKey) {
          cacheRef.value.delete(firstKey);
        }
      }
    }

    cacheRef.value.set(name, children);
    activeKey.value = name
  }, [name, children, max, include, exclude]);

  if (!name || !shouldCache(name)) {
    return <>{children}</>;
  }

  return (
    <>
      {Array.from(cacheRef.value.entries()).map(([key, component]) => {
        const isActive = activeKey.value === key;
        return (
          <div key={key} style={{ display: isActive ? "block" : "none" }}>
            <KeepAliveContext.Provider value={{ active: isActive }}>
              {component}
            </KeepAliveContext.Provider>
          </div>
        );
      })}
    </>
  );
};
