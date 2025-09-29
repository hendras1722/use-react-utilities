"use client";
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
exports.Cond = void 0;
exports.ConditionalGroup = ConditionalGroup;
exports.If = If;
exports.ElseIf = ElseIf;
exports.Else = Else;
exports.Show = Show;
const react_1 = __importStar(require("react"));
const ConditionalContext = (0, react_1.createContext)(null);
function ConditionalGroup({ children }) {
    // Hitung index mana yang harus dirender berdasarkan kondisi
    const matchedIndex = (0, react_1.useMemo)(() => {
        const childArray = react_1.Children.toArray(children);
        for (let i = 0; i < childArray.length; i++) {
            const child = childArray[i];
            if ((0, react_1.isValidElement)(child)) {
                // Check If component
                if ((child.type?.name === 'If' || child.type === If) && typeof child.props === 'object' && child.props !== null) {
                    if (child.props.condition === true) {
                        return i;
                    }
                }
                // Check ElseIf component
                else if ((child.type?.name === 'ElseIf' || child.type === ElseIf) && typeof child.props === 'object' && child.props !== null) {
                    if (child.props.condition === true) {
                        return i;
                    }
                }
                // Check Else component - selalu match jika belum ada yang match
                else if (child.type?.name === 'Else' || child.type === Else) {
                    return i;
                }
            }
        }
        return -1; // Tidak ada yang match
    }, [children]);
    return (react_1.default.createElement(ConditionalContext.Provider, { value: { matchedIndex } }, react_1.Children.map(children, (child, index) => {
        if ((0, react_1.isValidElement)(child)) {
            return (0, react_1.cloneElement)(child, { ...(child.props || {}), _index: index });
        }
        return child;
    })));
}
function If({ condition, children, _index }) {
    const context = (0, react_1.useContext)(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return condition ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
}
function ElseIf({ condition, children, _index }) {
    const context = (0, react_1.useContext)(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return condition ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
}
function Else({ children, _index }) {
    const context = (0, react_1.useContext)(ConditionalContext);
    if (!context) {
        // Fallback jika digunakan tanpa ConditionalGroup
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    // Render hanya jika ini adalah komponen pertama yang match
    return context.matchedIndex === _index ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
}
// Show component tetap sama - untuk conditional rendering sederhana
function Show({ when, children }) {
    return when ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
}
// Export sebagai object untuk kemudahan import
exports.Cond = {
    If,
    ElseIf,
    Else,
    Show,
    ConditionalGroup,
};
