"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActivated = void 0;
exports.onMounted = onMounted;
exports.onUnmounted = onUnmounted;
exports.onUpdated = onUpdated;
exports.onBeforeUpdate = onBeforeUpdate;
exports.onBeforeUnmount = onBeforeUnmount;
exports.onBeforeMount = onBeforeMount;
const react_1 = require("react");
const useRef_1 = require("./useRef");
const useWatchEffect_1 = require("./useWatchEffect");
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
const KeepAliveContext = (0, react_1.createContext)(null);
const useActivated = (name, callback) => {
    const ctx = (0, react_1.useContext)(KeepAliveContext);
    const wasActive = (0, useRef_1.ref)(false);
    (0, useWatchEffect_1.useWatch)([ctx?.activeKey, name, callback], (newValue) => {
        console.log(newValue);
    });
    (0, react_1.useEffect)(() => {
        if (!ctx)
            return;
        const isActive = ctx.activeKey === name;
        if (isActive && !wasActive.value) {
            callback();
        }
        wasActive.value = isActive;
    });
};
exports.useActivated = useActivated;
