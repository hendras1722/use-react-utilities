import React, { Component, type ReactNode } from 'react';
interface AppErrorProps {
    statusCode?: number;
    statusMessage?: string;
    data?: any;
}
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (props: ErrorFallbackProps) => ReactNode;
    fallbackRender?: React.FC<ErrorFallbackProps>;
    onError?: (error: AppError, errorInfo: React.ErrorInfo) => void;
    onReset?: () => void;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: AppError | null;
}
interface ErrorFallbackProps {
    error: AppError | null;
    resetError: () => void;
}
export declare class AppError extends Error {
    statusCode: number;
    statusMessage: string;
    data?: any;
    constructor({ statusCode, statusMessage, data }: AppErrorProps);
}
export declare const createError: (props: AppErrorProps) => never;
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    resetError: () => void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
}
export declare const useErrorHandler: () => {
    throwError: (props: AppErrorProps) => void;
};
export {};
