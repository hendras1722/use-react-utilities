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
exports.useErrorHandler = exports.ErrorBoundary = exports.createError = exports.AppError = void 0;
const react_1 = __importStar(require("react"));
const useRef_1 = require("../useRef");
const useWatchEffect_1 = require("../useWatchEffect");
// ============================================
// CUSTOM ERROR CLASS
// ============================================
class AppError extends Error {
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
exports.AppError = AppError;
// ============================================
// HELPER FUNCTION
// ============================================
const createError = (props) => {
    throw new AppError(props);
};
exports.createError = createError;
// ============================================
// DEFAULT ERROR DISPLAY
// ============================================
const DefaultErrorDisplay = ({ error, resetError }) => {
    const statusCode = error?.statusCode || 500;
    const statusMessage = error?.statusMessage || error?.message || 'Something went wrong';
    return (react_1.default.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        } },
        react_1.default.createElement("div", { style: {
                textAlign: 'center',
                maxWidth: '500px'
            } },
            react_1.default.createElement("h1", { style: {
                    fontSize: '72px',
                    margin: '0',
                    color: '#ef4444'
                } }, statusCode),
            react_1.default.createElement("h2", { style: {
                    fontSize: '24px',
                    margin: '20px 0',
                    color: '#1f2937'
                } }, statusMessage),
            react_1.default.createElement("button", { onClick: resetError, style: {
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
class ErrorBoundary extends react_1.Component {
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
                return react_1.default.createElement(FallbackComponent, { ...errorProps });
            }
            if (this.props.fallback) {
                return this.props.fallback(errorProps);
            }
            return react_1.default.createElement(DefaultErrorDisplay, { ...errorProps });
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
// ============================================
// HOOKS UNTUK ERROR HANDLING
// ============================================
const useErrorHandler = () => {
    const error = (0, useRef_1.ref)(null);
    // Throw error di useEffect agar bisa ditangkap Error Boundary
    (0, useWatchEffect_1.useWatch)(error.value, (newValue) => {
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
exports.useErrorHandler = useErrorHandler;
