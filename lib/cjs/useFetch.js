"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useFetch;
const ofetch_1 = require("ofetch");
const baseFetch = ofetch_1.ofetch.create({
    baseURL: process.env.BASE_URL ?? '/api',
});
function useFetch(url, options) {
    return baseFetch(url, options);
}
