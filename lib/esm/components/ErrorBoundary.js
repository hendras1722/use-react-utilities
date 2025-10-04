import React, { Component } from 'react';
import { ref } from '../useRef';
import { useWatch } from '../useWatchEffect';
// ============================================
// CUSTOM ERROR CLASS
// ============================================
export class AppError extends Error {
    statusCode;
    statusMessage;
    data;
    constructor({ statusCode = 500, statusMessage = 'Internal Server Error', data }) {
        super(statusMessage);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.data = data;
        this.name = 'AppError';
    }
}
// ============================================
// HELPER FUNCTION
// ============================================
export const createError = (props) => {
    throw new AppError(props);
};
// ============================================
// DEFAULT ERROR DISPLAY
// ============================================
const DefaultErrorDisplay = ({ error, resetError }) => {
    const statusCode = error?.statusCode || 500;
    const statusMessage = error?.statusMessage || error?.message || 'Something went wrong';
    return (React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        } },
        React.createElement("div", { style: {
                textAlign: 'center',
                maxWidth: '500px'
            } },
            React.createElement("h1", { style: {
                    fontSize: '72px',
                    margin: '0',
                    color: '#ef4444'
                } }, statusCode),
            React.createElement("h2", { style: {
                    fontSize: '24px',
                    margin: '20px 0',
                    color: '#1f2937'
                } }, statusMessage),
            React.createElement("button", { onClick: resetError, style: {
                    marginTop: '30px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                }, onMouseOver: (e) => e.currentTarget.style.backgroundColor = '#2563eb', onMouseOut: (e) => e.currentTarget.style.backgroundColor = '#3b82f6' }, "Try Again"))));
};
// ============================================
// ERROR BOUNDARY CLASS COMPONENT
// ============================================
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        if (error instanceof AppError) {
            return {
                hasError: true,
                error: error
            };
        }
        // Convert regular errors to AppError
        return {
            hasError: true,
            error: new AppError({
                statusCode: 500,
                statusMessage: error.message || 'An unexpected error occurred'
            })
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        if (this.props.onError && error instanceof AppError) {
            this.props.onError(error, errorInfo);
        }
    }
    resetError = () => {
        this.setState({
            hasError: false,
            error: null
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };
    render() {
        if (this.state.hasError) {
            const errorProps = {
                error: this.state.error,
                resetError: this.resetError
            };
            // Support both fallback and fallbackRender
            if (this.props.fallbackRender) {
                const FallbackComponent = this.props.fallbackRender;
                return React.createElement(FallbackComponent, { ...errorProps });
            }
            if (this.props.fallback) {
                return this.props.fallback(errorProps);
            }
            return React.createElement(DefaultErrorDisplay, { ...errorProps });
        }
        return this.props.children;
    }
}
// ============================================
// HOOKS UNTUK ERROR HANDLING
// ============================================
export const useErrorHandler = () => {
    const error = ref(null);
    // Throw error di useEffect agar bisa ditangkap Error Boundary
    useWatch(error.value, (newValue) => {
        if (newValue) {
            throw error.value;
        }
    }, {
        immediate: true
    });
    const throwError = (props) => {
        error.value = new AppError(props);
    };
    return { throwError };
};
