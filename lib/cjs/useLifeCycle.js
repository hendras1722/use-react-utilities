"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnMounted = OnMounted;
exports.OnUnmounted = OnUnmounted;
exports.OnUpdated = OnUpdated;
exports.OnBeforeUpdate = OnBeforeUpdate;
exports.OnBeforeUnmount = OnBeforeUnmount;
exports.OnBeforeMount = OnBeforeMount;
const react_1 = require("react");
const useRef_1 = require("./useRef");
function OnMounted(callback) {
    (0, react_1.useEffect)(() => {
        callback();
    }, []);
}
function OnUnmounted(callback) {
    (0, react_1.useEffect)(() => {
        return () => {
            callback();
        };
    }, []);
}
function OnUpdated(callback) {
    const hasMounted = (0, useRef_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (hasMounted.value) {
            callback();
        }
        else {
            hasMounted.value = true;
        }
    });
}
function OnBeforeUpdate(callback) {
    const isFirstRender = (0, useRef_1.useRef)(true);
    (0, react_1.useLayoutEffect)(() => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
            return;
        }
        callback();
    });
}
function OnBeforeUnmount(callback) {
    const callbackRef = (0, useRef_1.useRef)(callback);
    (0, react_1.useEffect)(() => {
        return () => {
            callbackRef.value();
        };
    }, []);
}
function OnBeforeMount(callback) {
    const hasRun = (0, useRef_1.useRef)(false);
    if (!hasRun.value) {
        callback();
        hasRun.value = true;
    }
}
