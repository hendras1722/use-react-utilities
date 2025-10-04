import React from 'react';
import { type AppError } from './playground/ErrorBoundary';


interface ErrorFallbackProps {
  error: AppError | null;
  resetError: () => void;
}

const CustomErrorDisplay: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#fef2f2',
      border: '2px solid #fecaca',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2 style={{ color: '#991b1b', marginTop: 0 }}>
        Oops! Error {error?.statusCode}
      </h2>
      <p style={{ color: '#7f1d1d' }}>
        {error?.statusMessage}
      </p>
      {error?.data && (
        <pre style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(error.data, null, 2)}
        </pre>
      )}
      <button
        onClick={resetError}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Kembali
      </button>
    </div>
  );
};

export default CustomErrorDisplay;