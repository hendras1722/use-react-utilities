"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teleport = Teleport;
const react_dom_1 = require("react-dom");
const useRef_1 = require("../useRef");
const useLifeCycle_1 = require("../useLifeCycle");
const useWatchEffect_1 = require("../useWatchEffect");
function Teleport({ to, children }) {
    const mounted = (0, useRef_1.ref)(false);
    const target = (0, useRef_1.ref)(null);
    (0, useLifeCycle_1.onMounted)(() => {
        mounted.value = true;
    });
    (0, useLifeCycle_1.onUnmounted)(() => {
        mounted.value = false;
    });
    (0, useWatchEffect_1.useWatch)([to, mounted.value], ([_toValue, mountedValue]) => {
        if (!mountedValue)
            return;
        let targetElement = null;
        if (typeof to === 'string') {
            if (to.startsWith('#')) {
                targetElement = document.getElementById(to.slice(1));
            }
            else if (to === 'body') {
                targetElement = document.body;
            }
            else {
                targetElement = document.querySelector(to);
            }
        }
        else {
            targetElement = to;
        }
        if (!targetElement) {
            console.warn(`Teleport target "${to}" tidak ditemukan`);
            return;
        }
        target.value = targetElement;
    });
    if (!mounted.value || !target.value)
        return null;
    return (0, react_dom_1.createPortal)(children, target.value);
}
