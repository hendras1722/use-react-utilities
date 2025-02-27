import { useState } from 'react'

type ChangeCaseType =
  | 'camelCase'
  | 'capitalCase'
  | 'constantCase'
  | 'dotCase'
  | 'kebabCase'
  | 'noCase'
  | 'pascalCase'
  | 'pascalSnakeCase'
  | 'pathCase'
  | 'sentenceCase'
  | 'snakeCase'
  | 'trainCase'

const caseTransformers = {
  camelCase: (str: string): string => {
    // Preserve spaces but make first letter lowercase and capitalize first letter after each space
    return str
      .replace(/^([A-Z])/, (match) => match.toLowerCase()) // First letter lowercase
      .replace(/\s+([a-z])/g, (_, char) => ' ' + char) // Keep spaces and don't change case
  },
  capitalCase: (str: string): string => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
  },
  constantCase: (str: string): string => {
    return str.toUpperCase().replace(/[^A-Z0-9]+/g, '_')
  },
  dotCase: (str: string): string => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '.')
  },
  kebabCase: (str: string): string => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
  },
  noCase: (str: string): string => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, ' ')
  },
  pascalCase: (str: string): string => {
    // Just capitalize the first letter of each word, preserving spaces
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  },
  pascalSnakeCase: (str: string): string => {
    return str
      .split(/[^a-zA-Z0-9]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('_')
  },
  pathCase: (str: string): string => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '/')
  },
  sentenceCase: (str: string): string => {
    return str.toLowerCase().replace(/^\w/, (char) => char.toUpperCase())
  },
  snakeCase: (str: string): string => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_')
  },
  trainCase: (str: string): string => {
    // First normalize the string by adding spaces between camelCase/PascalCase words
    const normalized = str
      // Add space before uppercase letters that follow lowercase letters
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Handle consecutive capitals (e.g., "HTML")
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim()

    // Then apply train-case transformation
    return (
      normalized
        .toLowerCase()
        // Replace any non-alphanumeric characters with hyphens
        .replace(/[^a-zA-Z0-9]+/g, '-')
        // Capitalize first letter of each word
        .replace(
          /(^|-)([a-z])/g,
          (_, separator, char) => separator + char.toUpperCase()
        )
    )
  },
}

const useChangeCase = (
  initialInput: string,
  type: ChangeCaseType
): [string, (value: string) => void] => {
  const [input, setInput] = useState(initialInput)
  const transformedValue = caseTransformers[type](input)
  return [transformedValue, setInput]
}

export { useChangeCase }
