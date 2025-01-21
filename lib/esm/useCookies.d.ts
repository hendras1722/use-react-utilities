interface CookieOptions {
    path?: string;
    expires?: Date | number;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    httpOnly?: boolean;
}
interface UseCookiesOptions {
    doNotParse?: boolean;
}
interface BasicRequest {
    headers: {
        cookie?: string;
    };
}
interface BasicResponse {
    setHeader(name: string, value: string | string[]): void;
    getHeader(name: string): string | string[] | undefined;
}
/**
 * Parse cookies from request headers
 */
export declare function parseCookies(req: BasicRequest): Record<string, string>;
/**
 * Set cookie helper
 */
export declare function setCookie(res: BasicResponse, name: string, value: any, options?: CookieOptions): void;
/**
 * Remove cookie helper
 */
export declare function removeCookie(res: BasicResponse, name: string, options?: CookieOptions): void;
/**
 * React hook to manage cookies on the client side
 */
export default function useCookies(dependencies?: string[] | null, { doNotParse }?: UseCookiesOptions): {
    get: (name: string) => any;
    getAll: () => Record<string, any>;
    set: (name: string, value: any, options?: CookieOptions) => void;
    remove: (name: string, options?: CookieOptions) => void;
};
export {};
