/**
 * MFE Error Boundary
 *
 * Isolates MFE failures to prevent shell crashes.
 * Provides retry functionality and minimal inline error UI.
 */

import React from 'react';

interface MfeErrorBoundaryProps {
  children: React.ReactNode;
  mfeName?: string;
  fallback?: React.ReactNode;
}

interface MfeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Error Boundary Component
 * Catches errors in MFE components and displays fallback UI
 */
export class MfeErrorBoundary extends React.Component<
  MfeErrorBoundaryProps,
  MfeErrorBoundaryState
> {
  constructor(props: MfeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<MfeErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    // console.error('MFE Error Boundary caught an error:', {
    //   mfeName: this.props.mfeName || 'Unknown MFE',
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
          className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="mb-4 flex justify-center">
              <svg
                className="w-16 h-16 text-red-500"
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
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              {this.props.mfeName
                ? `${this.props.mfeName} encountered an error`
                : 'Something went wrong'}
            </h2>
            <p className="text-sm text-red-700 mb-6">
              This feature is temporarily unavailable. Other parts of the application should
              continue to work normally.
            </p>

            {/* Error Details (in development only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-white p-4 rounded border border-red-300">
                <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Retry loading this feature"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Reload the entire page"
              >
                Reload Page
              </button>
            </div>

            {/* Retry Count (in development only) */}
            {import.meta.env.DEV && this.state.retryCount > 0 && (
              <p className="mt-4 text-xs text-red-600">Retry attempts: {this.state.retryCount}</p>
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
export function withMfeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  mfeName?: string,
  fallback?: React.ReactNode,
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <MfeErrorBoundary mfeName={mfeName} fallback={fallback}>
      <Component {...props} />
    </MfeErrorBoundary>
  );

  WrappedComponent.displayName = `withMfeErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
