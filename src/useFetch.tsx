import { type FetchOptions, ofetch } from 'ofetch'

const baseFetch = ofetch.create({
  baseURL: process.env.BASE_URL ?? '/api',
})

export default function useFetch<T = any>(
  url: string,
  options?: FetchOptions<'json', any>
): Promise<T> {
  return baseFetch<T>(url, options)
}
