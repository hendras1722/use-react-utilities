import React, { Component, type ReactNode } from 'react';
import { ref, useWatch } from 'use-react-utilities'

// ============================================
// TYPES
// ============================================
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

// ============================================
// CUSTOM ERROR CLASS
// ============================================
export class AppError extends Error {
  statusCode: number;
  statusMessage: string;
  data?: any;

  constructor({ statusCode = 500, statusMessage = 'Internal Server Error', data }: AppErrorProps) {
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
export const createError = (props: AppErrorProps): never => {
  throw new AppError(props);
};

// ============================================
// DEFAULT ERROR DISPLAY
// ============================================
const DefaultErrorDisplay: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const statusCode = error?.statusCode || 500;
  const statusMessage = error?.statusMessage || error?.message || 'Something went wrong';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '72px',
          margin: '0',
          color: '#ef4444'
        }}>
          {statusCode}
        </h1>
        <h2 style={{
          fontSize: '24px',
          margin: '20px 0',
          color: '#1f2937'
        }}>
          {statusMessage}
        </h2>
        <button
          onClick={resetError}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// ============================================
// ERROR BOUNDARY CLASS COMPONENT
// ============================================
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
      const errorProps: ErrorFallbackProps = {
        error: this.state.error,
        resetError: this.resetError
      };

      // Support both fallback and fallbackRender
      if (this.props.fallbackRender) {
        const FallbackComponent = this.props.fallbackRender;
        return <FallbackComponent {...errorProps} />;
      }

      if (this.props.fallback) {
        return this.props.fallback(errorProps);
      }

      return <DefaultErrorDisplay {...errorProps} />;
    }

    return this.props.children;
  }
}

// ============================================
// HOOKS UNTUK ERROR HANDLING
// ============================================
export const useErrorHandler = () => {
  const error = ref<AppError | null>(null);

  // Throw error di useEffect agar bisa ditangkap Error Boundary
  useWatch(error.value, (newValue) => {
    if (newValue) {
      throw error.value
    }
  }, {
    immediate: true
  })

  const throwError = (props: AppErrorProps) => {
    error.value = new AppError(props)
  };

  return { throwError };
};