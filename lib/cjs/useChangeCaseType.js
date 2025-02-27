"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangeCase = void 0;
const react_1 = require("react");
const caseTransformers = {
    camelCase: (str) => {
        // Preserve spaces but make first letter lowercase and capitalize first letter after each space
        return str
            .replace(/^([A-Z])/, (match) => match.toLowerCase()) // First letter lowercase
            .replace(/\s+([a-z])/g, (_, char) => ' ' + char); // Keep spaces and don't change case
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
        // Just capitalize the first letter of each word, preserving spaces
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
        // First normalize the string by adding spaces between camelCase/PascalCase words
        const normalized = str
            // Add space before uppercase letters that follow lowercase letters
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // Handle consecutive capitals (e.g., "HTML")
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .trim();
        // Then apply train-case transformation
        return (normalized
            .toLowerCase()
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
exports.useChangeCase = useChangeCase;
