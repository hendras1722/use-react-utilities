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
export declare function useHead(config: HeadConfig): void;
export {};
