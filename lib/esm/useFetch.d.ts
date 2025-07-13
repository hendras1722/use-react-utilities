import { type FetchOptions } from 'ofetch';
export default function useFetch<T = any>(url: string, options?: FetchOptions<'json', any>): Promise<T>;
