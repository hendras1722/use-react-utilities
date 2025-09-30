import React, { useState, useRef, useEffect, ReactNode } from 'react';


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
  max = 10
}) => {
  const cacheRef = useRef<Map<string, ReactNode>>(new Map());
  const [activeKey, setActiveKey] = useState<string>('');

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
    if (!name || !shouldCache(name)) {
      return;
    }

    // Tambah ke cache jika belum ada
    if (!cacheRef.current.has(name)) {
      if (cacheRef.current.size >= max) {
        const firstKey = cacheRef.current.keys().next().value;
        if (firstKey) {
          cacheRef.current.delete(firstKey);
        }
      }
      cacheRef.current.set(name, children);
    } else {
      // Update children jika sudah ada
      cacheRef.current.set(name, children);
    }

    setActiveKey(name);
  }, [name, max, include, exclude]);

  // Jika tidak perlu cache, render langsung
  if (!name || !shouldCache(name)) {
    return <>{children}</>;
  }

  return (
    <>
      {Array.from(cacheRef.current.entries()).map(([key, component]) => (
        <div
          key={key}
          style={{ display: activeKey === key ? 'block' : 'none' }}
        >
          {component}
        </div>
      ))}
    </>
  );
};