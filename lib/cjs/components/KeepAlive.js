"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepAlive = exports.useActivated = void 0;
const react_1 = __importStar(require("react"));
const useWatchEffect_1 = require("../useWatchEffect");
const useRef_1 = require("../useRef");
const KeepAliveContext = (0, react_1.createContext)(null);
const useActivated = (callback) => {
    const ctx = (0, react_1.useContext)(KeepAliveContext);
    const wasActive = (0, useRef_1.ref)(false);
    (0, useWatchEffect_1.useWatch)([ctx, callback], () => {
        if (!ctx)
            return;
        if (ctx?.active && !wasActive.value) {
            callback();
        }
        wasActive.value = ctx.active;
    }, {
        immediate: true
    });
};
exports.useActivated = useActivated;
const KeepAlive = ({ children, name, include, exclude, max = 10, }) => {
    const cacheRef = (0, useRef_1.ref)(new Map());
    const activeKey = (0, useRef_1.ref)('');
    const shouldCache = (cacheName) => {
        if (include) {
            const includeList = Array.isArray(include) ? include : [include];
            return includeList.includes(cacheName);
        }
        if (exclude) {
            const excludeList = Array.isArray(exclude) ? exclude : [exclude];
            return !excludeList.includes(cacheName);
        }
        return true;
    };
    (0, react_1.useEffect)(() => {
        if (!name || !shouldCache(name))
            return;
        if (!cacheRef.value.has(name)) {
            if (cacheRef.value.size >= max) {
                const firstKey = cacheRef.value.keys().next().value;
                if (firstKey) {
                    cacheRef.value.delete(firstKey);
                }
            }
        }
        cacheRef.value.set(name, children);
        activeKey.value = name;
    }, [name, children, max, include, exclude]);
    if (!name || !shouldCache(name)) {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null, Array.from(cacheRef.value.entries()).map(([key, component]) => {
        const isActive = activeKey.value === key;
        return (react_1.default.createElement("div", { key: key, style: { display: isActive ? "block" : "none" } },
            react_1.default.createElement(KeepAliveContext.Provider, { value: { active: isActive } }, component)));
    })));
};
exports.KeepAlive = KeepAlive;
