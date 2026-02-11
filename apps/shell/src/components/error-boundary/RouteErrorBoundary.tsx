/**
 * RouteErrorBoundary
 *
 * Route-level error boundary for route-specific errors.
 * Catches errors within a specific route and allows users to navigate to other routes.
 * Provides route-specific fallback UI with navigation options.
 */

import React from 'react';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Route Error Boundary Class Component
 */
class RouteErrorBoundaryClass extends React.Component<
  RouteErrorBoundaryProps & { onNavigate?: (path: string) => void },
  RouteErrorBoundaryState
> {
  constructor(props: RouteErrorBoundaryProps & { onNavigate?: (path: string) => void }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RouteErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log route-level error
    // console.error('🟠 [RouteErrorBoundary] Route-level error:', {
    //   route: this.props.routeName || 'Unknown Route',
    //   error: error.message,
    //   componentStack: errorInfo.componentStack,
    //   timestamp: new Date().toISOString(),
    //   retryCount: this.state.retryCount,
    // });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // TODO: Send to error tracking service
    // trackRouteError({
    //   route: this.props.routeName,
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

  handleGoHome = (): void => {
    if (this.props.onNavigate) {
      this.props.onNavigate('/');
    }
  };

  handleGoBack = (): void => {
    window.history.back();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="w-full max-w-lg sm:max-w-3xl">
            {/* Error Container */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-amber-500">
              {/* Error Icon */}
              <div className="mb-6 flex justify-center">
                <AlertCircle className="h-16 w-16 text-amber-500" />
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Page Error</h1>

              {/* Error Description */}
              <p className="text-slate-600 text-center mb-6">
                {this.props.routeName
                  ? `The ${this.props.routeName} page encountered an error.`
                  : 'This page encountered an error.'}{' '}
                You can try again or navigate to another section.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <summary className="cursor-pointer font-semibold text-amber-900 mb-3">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">Error:</p>
                      <pre className="bg-white p-2 rounded border border-amber-300 overflow-auto max-h-20 whitespace-pre-wrap text-amber-700">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="font-semibold text-amber-800 mb-1">Stack:</p>
                        <pre className="bg-white p-2 rounded border border-amber-300 overflow-auto max-h-24 whitespace-pre-wrap text-amber-700 text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                  aria-label="Try loading this page again"
                >
                  Try Again
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleGoBack}
                    className="px-4 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    aria-label="Go back to previous page"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="px-4 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    aria-label="Go to home page"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </button>
                </div>
              </div>

              {/* Retry Counter (Development) */}
              {import.meta.env.DEV && this.state.retryCount > 0 && (
                <p className="text-center text-xs text-slate-500">
                  Retry attempts: {this.state.retryCount}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper component for RouteErrorBoundary
 * Integrates with React Router for navigation
 */
export function RouteErrorBoundary({
  children,
  routeName,
}: RouteErrorBoundaryProps): React.ReactElement {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <RouteErrorBoundaryClass onNavigate={handleNavigate} routeName={routeName}>
      {children}
    </RouteErrorBoundaryClass>
  );
}
