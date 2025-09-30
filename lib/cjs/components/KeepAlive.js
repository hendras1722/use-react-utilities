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
exports.KeepAlive = void 0;
const react_1 = __importStar(require("react"));
const KeepAlive = ({ children, name, include, exclude, max = 10 }) => {
    const cacheRef = (0, react_1.useRef)(new Map());
    const [activeKey, setActiveKey] = (0, react_1.useState)('');
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
        if (!name || !shouldCache(name)) {
            return;
        }
        // Tambah ke cache jika belum ada
        if (!cacheRef.current.has(name)) {
            if (cacheRef.current.size >= max) {
                const firstKey = cacheRef.current.keys().next().value;
                if (firstKey) {
                    cacheRef.current.delete(firstKey);
                }
            }
            cacheRef.current.set(name, children);
        }
        else {
            // Update children jika sudah ada
            cacheRef.current.set(name, children);
        }
        setActiveKey(name);
    }, [name, max, include, exclude]);
    // Jika tidak perlu cache, render langsung
    if (!name || !shouldCache(name)) {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null, Array.from(cacheRef.current.entries()).map(([key, component]) => (react_1.default.createElement("div", { key: key, style: { display: activeKey === key ? 'block' : 'none' } }, component)))));
};
exports.KeepAlive = KeepAlive;
