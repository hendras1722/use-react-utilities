import { useEffect } from 'react';

// Type definitions matching Vue's useHead
interface Base {
  href: string;
  target?: string;
}

interface Link {
  rel: string;
  href?: string;
  hreflang?: string;
  media?: string;
  type?: string;
  sizes?: string;
  as?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  referrerpolicy?: string;
  [key: string]: any;
}

interface Meta {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
  httpEquiv?: string;
  [key: string]: any;
}

interface Style {
  innerHTML?: string;
  cssText?: string;
  type?: string;
  media?: string;
  [key: string]: any;
}

interface Script {
  src?: string;
  innerHTML?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  crossorigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  nomodule?: boolean;
  [key: string]: any;
}

interface Noscript {
  innerHTML?: string;
  [key: string]: any;
}

interface HtmlAttributes {
  [key: string]: string;
}

interface BodyAttributes {
  [key: string]: string;
}

interface HeadConfig {
  title?: string;
  titleTemplate?: string | ((title?: string) => string);
  base?: Base;
  link?: Link[];
  meta?: Meta[];
  style?: Style[];
  script?: Script[];
  noscript?: Noscript[];
  htmlAttrs?: HtmlAttributes;
  bodyAttrs?: BodyAttributes;
}

export function useHead(config: HeadConfig) {
  useEffect(() => {
    const cleanup: (() => void)[] = [];

    // Update title with template support
    if (config.title !== undefined || config.titleTemplate !== undefined) {
      const prevTitle = document.title;

      let newTitle = config.title || '';

      if (config.titleTemplate) {
        if (typeof config.titleTemplate === 'function') {
          newTitle = config.titleTemplate(config.title);
        } else {
          newTitle = config.titleTemplate.replace('%s', config.title || '');
        }
      }

      document.title = newTitle;
      cleanup.push(() => {
        document.title = prevTitle;
      });
    }

    // Update base tag
    if (config.base) {
      let baseEl = document.querySelector('base');
      const isNewBase = !baseEl;

      if (isNewBase) {
        baseEl = document.createElement('base');
        document.head.insertBefore(baseEl, document.head.firstChild);
      }

      const prevHref = baseEl?.href;
      const prevTarget = baseEl?.target;

      if (!baseEl) return
      baseEl.href = config.base.href;
      if (config.base.target) baseEl.target = config.base.target;

      cleanup.push(() => {
        if (baseEl) {
          if (isNewBase) {
            baseEl.remove();
          } else {
            baseEl.href = prevHref as string;
            baseEl.target = prevTarget as string;
          }
        }
      });
    }

    // Update link tags
    if (config.link) {
      config.link.forEach((link) => {
        const el = document.createElement('link');

        Object.entries(link).forEach(([key, value]) => {
          if (value !== undefined) {
            el.setAttribute(key, String(value));
          }
        });

        document.head.appendChild(el);
        cleanup.push(() => el.remove());
      });
    }

    // Update meta tags
    if (config.meta) {
      config.meta.forEach((meta) => {
        const el = document.createElement('meta');

        Object.entries(meta).forEach(([key, value]) => {
          if (value !== undefined) {
            el.setAttribute(key, String(value));
          }
        });

        document.head.appendChild(el);
        cleanup.push(() => el.remove());
      });
    }

    // Update style tags
    if (config.style) {
      config.style.forEach((style) => {
        const el = document.createElement('style');

        if (style.innerHTML) {
          el.innerHTML = style.innerHTML;
        } else if (style.cssText) {
          el.innerHTML = style.cssText;
        }

        Object.entries(style).forEach(([key, value]) => {
          if (key !== 'innerHTML' && key !== 'cssText' && value !== undefined) {
            el.setAttribute(key, String(value));
          }
        });

        document.head.appendChild(el);
        cleanup.push(() => el.remove());
      });
    }

    // Update script tags
    if (config.script) {
      config.script.forEach((script) => {
        const el = document.createElement('script');

        if (script.innerHTML) {
          el.innerHTML = script.innerHTML;
        }

        Object.entries(script).forEach(([key, value]) => {
          if (key !== 'innerHTML' && value !== undefined) {
            if (typeof value === 'boolean') {
              if (value) el.setAttribute(key, '');
            } else {
              el.setAttribute(key, String(value));
            }
          }
        });

        document.head.appendChild(el);
        cleanup.push(() => el.remove());
      });
    }

    // Update noscript tags
    if (config.noscript) {
      config.noscript.forEach((noscript) => {
        const el = document.createElement('noscript');

        if (noscript.innerHTML) {
          el.innerHTML = noscript.innerHTML;
        }

        Object.entries(noscript).forEach(([key, value]) => {
          if (key !== 'innerHTML' && value !== undefined) {
            el.setAttribute(key, String(value));
          }
        });

        document.head.appendChild(el);
        cleanup.push(() => el.remove());
      });
    }

    // Update html attributes
    if (config.htmlAttrs) {
      const prevAttrs: Record<string, string | null> = {};
      Object.entries(config.htmlAttrs).forEach(([key, value]) => {
        prevAttrs[key] = document.documentElement.getAttribute(key);
        document.documentElement.setAttribute(key, value);
      });
      cleanup.push(() => {
        Object.entries(prevAttrs).forEach(([key, value]) => {
          if (value === null) {
            document.documentElement.removeAttribute(key);
          } else {
            document.documentElement.setAttribute(key, value);
          }
        });
      });
    }

    // Update body attributes
    if (config.bodyAttrs) {
      const prevAttrs: Record<string, string | null> = {};
      Object.entries(config.bodyAttrs).forEach(([key, value]) => {
        prevAttrs[key] = document.body.getAttribute(key);
        document.body.setAttribute(key, value);
      });
      cleanup.push(() => {
        Object.entries(prevAttrs).forEach(([key, value]) => {
          if (value === null) {
            document.body.removeAttribute(key);
          } else {
            document.body.setAttribute(key, value);
          }
        });
      });
    }

    // Cleanup function
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [config]);
}
