/**
 * Interface untuk konfigurasi SEO meta tags
 */
export interface SeoMetaConfig {
    title?: string;
    description?: string;
    keywords?: string[] | string;
    author?: string;
    viewport?: string;
    robots?: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    ogSiteName?: string;
    ogLocale?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterSite?: string;
    twitterCreator?: string;
}
/**
 * Custom hook untuk mengelola SEO meta tags di React
 * Terinspirasi dari useSeoMeta Vue 3
 */
export declare const useSeoMeta: (metaConfig: SeoMetaConfig) => void;
