"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMounted = onMounted;
exports.onUnmounted = onUnmounted;
exports.onUpdated = onUpdated;
exports.onBeforeUpdate = onBeforeUpdate;
exports.onBeforeUnmount = onBeforeUnmount;
exports.onBeforeMount = onBeforeMount;
const react_1 = require("react");
const useRef_1 = require("./useRef");
function onMounted(callback) {
    (0, react_1.useEffect)(() => {
        callback();
    }, []);
}
function onUnmounted(callback) {
    (0, react_1.useEffect)(() => {
        return () => {
            callback();
        };
    }, []);
}
function onUpdated(callback) {
    const hasMounted = (0, useRef_1.ref)(false);
    (0, react_1.useEffect)(() => {
        if (hasMounted.value) {
            callback();
        }
        else {
            hasMounted.value = true;
        }
    });
}
function onBeforeUpdate(callback) {
    const isFirstRender = (0, useRef_1.ref)(true);
    (0, react_1.useLayoutEffect)(() => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
            return;
        }
        callback();
    });
}
function onBeforeUnmount(callback) {
    const callbackRef = (0, useRef_1.ref)(callback);
    (0, react_1.useEffect)(() => {
        return () => {
            callbackRef.value();
        };
    }, []);
}
function onBeforeMount(callback) {
    const hasRun = (0, useRef_1.ref)(false);
    if (!hasRun.value) {
        callback();
        hasRun.value = true;
    }
}
