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
exports.CaseConverter = void 0;
const react_1 = __importStar(require("react"));
const caseTransformers = {
    camelCase: (str) => {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
    },
    capitalCase: (str) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    },
    constantCase: (str) => {
        return str.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
    },
    dotCase: (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '.');
    },
    kebabCase: (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
    },
    noCase: (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ' ');
    },
    pascalCase: (str) => {
        const camel = caseTransformers.camelCase(str);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
    pascalSnakeCase: (str) => {
        return str
            .split(/[^a-zA-Z0-9]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('_');
    },
    pathCase: (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '/');
    },
    sentenceCase: (str) => {
        return str.toLowerCase().replace(/^\w/, (char) => char.toUpperCase());
    },
    snakeCase: (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
    },
    trainCase: (str) => {
        // Fixed trainCase transformation
        return (str
            // Insert a space before capital letters
            .replace(/([A-Z])/g, ' $1')
            // Handle consecutive capitals (e.g., "HTML")
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            // Convert to lowercase and trim extra spaces
            .toLowerCase()
            .trim()
            // Replace any non-alphanumeric characters with hyphens
            .replace(/[^a-zA-Z0-9]+/g, '-')
            // Capitalize first letter of each word
            .replace(/(^|-)([a-z])/g, (_, separator, char) => separator + char.toUpperCase()));
    },
};
const useChangeCase = (initialInput, type) => {
    const [input, setInput] = (0, react_1.useState)(initialInput);
    const transformedValue = caseTransformers[type](input);
    return [transformedValue, setInput];
};
const CaseConverter = () => {
    const [selectedCase, setSelectedCase] = (0, react_1.useState)('camelCase');
    const [text, setText] = useChangeCase('Hello World', selectedCase);
    const [inputText, setInputText] = (0, react_1.useState)('Hello World');
    const cases = [
        ['camelCase', 'capitalCase', 'constantCase', 'dotCase'],
        ['kebabCase', 'noCase', 'pascalCase', 'pascalSnakeCase'],
        ['pathCase', 'sentenceCase', 'snakeCase', 'trainCase'],
    ];
    const handleInputChange = (e) => {
        setInputText(e.target.value);
        setText(e.target.value);
    };
    return (react_1.default.createElement("div", { className: "bg-gray-900 p-6 rounded-lg text-gray-300 max-w-3xl" },
        react_1.default.createElement("div", { className: "mb-6" },
            react_1.default.createElement("input", { type: "text", value: inputText, onChange: handleInputChange, className: "w-full bg-gray-800 border border-gray-700 rounded p-2 text-gray-300", placeholder: "Enter text to transform..." })),
        cases.map((row, rowIndex) => (react_1.default.createElement("div", { key: rowIndex, className: "flex gap-4 mb-2" }, row.map((caseType) => (react_1.default.createElement("button", { key: caseType, onClick: () => setSelectedCase(caseType), className: `flex items-center gap-2 hover:text-gray-100 transition-colors ${selectedCase === caseType ? 'text-emerald-400' : ''}` },
            react_1.default.createElement("div", { className: `w-3 h-3 rounded-full ${selectedCase === caseType ? 'bg-emerald-400' : 'bg-gray-600'}` }),
            react_1.default.createElement("span", { className: "text-lg" }, caseType))))))),
        react_1.default.createElement("div", { className: "mt-6 p-4 bg-gray-800 rounded" },
            react_1.default.createElement("p", { className: "font-mono text-lg" }, text))));
};
exports.CaseConverter = CaseConverter;
