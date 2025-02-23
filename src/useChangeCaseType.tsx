import React, { useState } from 'react'

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
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
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
    const camel = caseTransformers.camelCase(str)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
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
    // Fixed trainCase transformation
    return (
      str
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

const CaseConverter = () => {
  const [selectedCase, setSelectedCase] = useState<ChangeCaseType>('camelCase')
  const [text, setText] = useChangeCase('Hello World', selectedCase)
  const [inputText, setInputText] = useState('Hello World')

  const cases: ChangeCaseType[][] = [
    ['camelCase', 'capitalCase', 'constantCase', 'dotCase'],
    ['kebabCase', 'noCase', 'pascalCase', 'pascalSnakeCase'],
    ['pathCase', 'sentenceCase', 'snakeCase', 'trainCase'],
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
    setText(e.target.value)
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg text-gray-300 max-w-3xl">
      <div className="mb-6">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-gray-300"
          placeholder="Enter text to transform..."
        />
      </div>

      {cases.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-2">
          {row.map((caseType) => (
            <button
              key={caseType}
              onClick={() => setSelectedCase(caseType)}
              className={`flex items-center gap-2 hover:text-gray-100 transition-colors ${
                selectedCase === caseType ? 'text-emerald-400' : ''
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedCase === caseType ? 'bg-emerald-400' : 'bg-gray-600'
                }`}
              />
              <span className="text-lg">{caseType}</span>
            </button>
          ))}
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-800 rounded">
        <p className="font-mono text-lg">{text}</p>
      </div>
    </div>
  )
}

export { CaseConverter }
