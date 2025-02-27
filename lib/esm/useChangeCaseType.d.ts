type ChangeCaseType = 'camelCase' | 'capitalCase' | 'constantCase' | 'dotCase' | 'kebabCase' | 'noCase' | 'pascalCase' | 'pascalSnakeCase' | 'pathCase' | 'sentenceCase' | 'snakeCase' | 'trainCase';
declare const useChangeCase: (initialInput: string, type: ChangeCaseType) => [string, (value: string) => void];
export { useChangeCase };
