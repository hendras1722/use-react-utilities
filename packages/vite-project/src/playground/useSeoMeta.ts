import { useEffect } from 'react';

/**
 * Interface untuk konfigurasi SEO meta tags
 */
export interface SeoMetaConfig {
  // Basic meta tags
  title?: string;
  description?: string;
  keywords?: string[] | string;
  author?: string;
  viewport?: string;
  robots?: string;
  canonical?: string;

  // Open Graph tags
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  ogLocale?: string;

  // Twitter Card tags
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

interface OriginalMetaData {
  content: string;
  attribute: string;
}

interface CreatedElement {
  element: HTMLMetaElement | HTMLLinkElement;
  attribute?: string;
  name?: string;
  isLink?: boolean;
}

/**
 * Custom hook untuk mengelola SEO meta tags di React
 * Terinspirasi dari useSeoMeta Vue 3
 */
export const useSeoMeta = (metaConfig: SeoMetaConfig): void => {
  useEffect(() => {
    const originalMeta: Record<string, string | OriginalMetaData> = {};
    const createdElements: CreatedElement[] = [];

    // Helper untuk set/update meta tag
    const setMetaTag = (name: string, content: string, isProperty: boolean = false): void => {
      if (!content) return;

      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

      if (element) {
        // Simpan nilai original
        if (!originalMeta[name]) {
          originalMeta[name] = {
            content: element.getAttribute('content') || '',
            attribute
          };
        }
        element.setAttribute('content', content);
      } else {
        // Buat element baru
        const newElement = document.createElement('meta');
        newElement.setAttribute(attribute, name);
        newElement.setAttribute('content', content);
        document.head.appendChild(newElement);
        createdElements.push({ element: newElement, attribute, name });
      }
    };

    // Set title
    if (metaConfig.title) {
      const originalTitle = document.title;
      document.title = metaConfig.title;
      originalMeta.title = originalTitle;
    }

    // Set description
    if (metaConfig.description) {
      setMetaTag('description', metaConfig.description);
    }

    // Set keywords
    if (metaConfig.keywords) {
      const keywords = Array.isArray(metaConfig.keywords)
        ? metaConfig.keywords.join(', ')
        : metaConfig.keywords;
      setMetaTag('keywords', keywords);
    }

    // Set author
    if (metaConfig.author) {
      setMetaTag('author', metaConfig.author);
    }

    // Set viewport
    if (metaConfig.viewport) {
      setMetaTag('viewport', metaConfig.viewport);
    }

    // Set robots
    if (metaConfig.robots) {
      setMetaTag('robots', metaConfig.robots);
    }

    // Set canonical URL
    if (metaConfig.canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (link) {
        originalMeta.canonical = link.getAttribute('href') || '';
        link.setAttribute('href', metaConfig.canonical);
      } else {
        const newLink = document.createElement('link');
        newLink.setAttribute('rel', 'canonical');
        newLink.setAttribute('href', metaConfig.canonical);
        document.head.appendChild(newLink);
        createdElements.push({ element: newLink, isLink: true });
      }
    }

    // Open Graph tags
    if (metaConfig.ogTitle) {
      setMetaTag('og:title', metaConfig.ogTitle, true);
    }
    if (metaConfig.ogDescription) {
      setMetaTag('og:description', metaConfig.ogDescription, true);
    }
    if (metaConfig.ogImage) {
      setMetaTag('og:image', metaConfig.ogImage, true);
    }
    if (metaConfig.ogUrl) {
      setMetaTag('og:url', metaConfig.ogUrl, true);
    }
    if (metaConfig.ogType) {
      setMetaTag('og:type', metaConfig.ogType, true);
    }
    if (metaConfig.ogSiteName) {
      setMetaTag('og:site_name', metaConfig.ogSiteName, true);
    }
    if (metaConfig.ogLocale) {
      setMetaTag('og:locale', metaConfig.ogLocale, true);
    }

    // Twitter Card tags
    if (metaConfig.twitterCard) {
      setMetaTag('twitter:card', metaConfig.twitterCard);
    }
    if (metaConfig.twitterTitle) {
      setMetaTag('twitter:title', metaConfig.twitterTitle);
    }
    if (metaConfig.twitterDescription) {
      setMetaTag('twitter:description', metaConfig.twitterDescription);
    }
    if (metaConfig.twitterImage) {
      setMetaTag('twitter:image', metaConfig.twitterImage);
    }
    if (metaConfig.twitterSite) {
      setMetaTag('twitter:site', metaConfig.twitterSite);
    }
    if (metaConfig.twitterCreator) {
      setMetaTag('twitter:creator', metaConfig.twitterCreator);
    }

    // Cleanup function
    return () => {
      // Restore original title
      if (originalMeta.title && typeof originalMeta.title === 'string') {
        document.title = originalMeta.title;
      }

      // Restore or remove meta tags
      Object.keys(originalMeta).forEach((key) => {
        if (key === 'title' || key === 'canonical') return;

        const meta = originalMeta[key] as OriginalMetaData;
        const { content, attribute } = meta;
        const element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

        if (element && content) {
          element.setAttribute('content', content);
        }
      });

      // Restore canonical if it was original
      if (originalMeta.canonical && typeof originalMeta.canonical === 'string') {
        const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (link) {
          link.setAttribute('href', originalMeta.canonical);
        }
      }

      // Remove created elements
      createdElements.forEach(({ element }) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [
    metaConfig.title,
    metaConfig.description,
    metaConfig.keywords,
    metaConfig.author,
    metaConfig.viewport,
    metaConfig.robots,
    metaConfig.canonical,
    metaConfig.ogTitle,
    metaConfig.ogDescription,
    metaConfig.ogImage,
    metaConfig.ogUrl,
    metaConfig.ogType,
    metaConfig.ogSiteName,
    metaConfig.ogLocale,
    metaConfig.twitterCard,
    metaConfig.twitterTitle,
    metaConfig.twitterDescription,
    metaConfig.twitterImage,
    metaConfig.twitterSite,
    metaConfig.twitterCreator
  ]);
};