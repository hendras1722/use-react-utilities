import React, { useState } from 'react';
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
    const [input, setInput] = useState(initialInput);
    const transformedValue = caseTransformers[type](input);
    return [transformedValue, setInput];
};
const CaseConverter = () => {
    const [selectedCase, setSelectedCase] = useState('camelCase');
    const [text, setText] = useChangeCase('Hello World', selectedCase);
    const [inputText, setInputText] = useState('Hello World');
    const cases = [
        ['camelCase', 'capitalCase', 'constantCase', 'dotCase'],
        ['kebabCase', 'noCase', 'pascalCase', 'pascalSnakeCase'],
        ['pathCase', 'sentenceCase', 'snakeCase', 'trainCase'],
    ];
    const handleInputChange = (e) => {
        setInputText(e.target.value);
        setText(e.target.value);
    };
    return (React.createElement("div", { className: "bg-gray-900 p-6 rounded-lg text-gray-300 max-w-3xl" },
        React.createElement("div", { className: "mb-6" },
            React.createElement("input", { type: "text", value: inputText, onChange: handleInputChange, className: "w-full bg-gray-800 border border-gray-700 rounded p-2 text-gray-300", placeholder: "Enter text to transform..." })),
        cases.map((row, rowIndex) => (React.createElement("div", { key: rowIndex, className: "flex gap-4 mb-2" }, row.map((caseType) => (React.createElement("button", { key: caseType, onClick: () => setSelectedCase(caseType), className: `flex items-center gap-2 hover:text-gray-100 transition-colors ${selectedCase === caseType ? 'text-emerald-400' : ''}` },
            React.createElement("div", { className: `w-3 h-3 rounded-full ${selectedCase === caseType ? 'bg-emerald-400' : 'bg-gray-600'}` }),
            React.createElement("span", { className: "text-lg" }, caseType))))))),
        React.createElement("div", { className: "mt-6 p-4 bg-gray-800 rounded" },
            React.createElement("p", { className: "font-mono text-lg" }, text))));
};
export { CaseConverter };
