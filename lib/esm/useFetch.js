import { ofetch } from 'ofetch';
const baseFetch = ofetch.create({
    baseURL: process.env.BASE_URL ?? '/api',
});
export default function useFetch(url, options) {
    return baseFetch(url, options);
}
