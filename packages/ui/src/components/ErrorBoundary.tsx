/**
 * Error Boundary Component
 *
 * Isolates component failures to prevent crashes.
 * Provides retry functionality and minimal inline error UI.
 */

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  mfeName?: string;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Error Boundary Component
 * Catches errors in components and displays fallback UI
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(_error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    // console.error('Error Boundary caught an error:', {
    //   mfeName: this.props.mfeName || 'Unknown Component',
    //   error: error.message,
    //   componentStack: errorInfo.componentStack,
    //   retryCount: this.state.retryCount,
    // });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // TODO: Send to error tracking service (e.g., Sentry)
    // trackError({
    //   mfeName: this.props.mfeName,
    //   error,
    //   errorInfo,
    // });
  }

  handleRetry = (): void => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default minimal inline error UI
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-3 flex justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {this.props.mfeName
                ? `${this.props.mfeName} encountered an error`
                : 'Something went wrong'}
            </h3>
            <p className="text-sm text-red-700 mb-4">This item is temporarily unavailable.</p>

            {/* Error Details (in development only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 text-left bg-white p-3 rounded border border-red-300">
                <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 overflow-auto max-h-32 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Retry loading this item"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-3 py-1.5 bg-white text-red-700 text-sm border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Reload the entire page"
              >
                Reload Page
              </button>
            </div>

            {/* Retry Count (in development only) */}
            {import.meta.env.DEV && this.state.retryCount > 0 && (
              <p className="mt-3 text-xs text-red-600">Retry attempts: {this.state.retryCount}</p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  mfeName?: string,
  fallback?: React.ReactNode,
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary mfeName={mfeName} fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
