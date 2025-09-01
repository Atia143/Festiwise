'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_parameters: {
          error_boundary: true,
          component_stack: errorInfo.componentStack,
          error_stack: error.stack,
        },
      });
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} reset={this.reset} />;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Don&apos;t worry, we&apos;ve been notified and are working on a fix.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.reset}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="block mx-auto text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Custom error fallback components
export const QuizErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => (
  <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
    <div className="text-4xl mb-4">🔧</div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Quiz Temporarily Unavailable</h3>
    <p className="text-red-600 mb-4">
      We&apos;re experiencing issues with the quiz. Please try again in a moment.
    </p>
    <button
      onClick={reset}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Retry Quiz
    </button>
  </div>
);

export const FestivalCardErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ reset }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
    <div className="text-2xl mb-2">⚠️</div>
    <p className="text-sm text-gray-600 mb-3">Failed to load festival</p>
    <button
      onClick={reset}
      className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

export default ErrorBoundary;
