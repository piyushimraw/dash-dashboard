/**
 * AppErrorBoundary
 *
 * Root-level error boundary for catastrophic errors.
 * Catches errors that would crash the entire application.
 * Provides full-page fallback UI with options to reload or contact support.
 */

import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

/**
 * Root Error Boundary Component
 * Handles application-level catastrophic errors
 */
export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console
    console.error('🔴 [AppErrorBoundary] Catastrophic Application Error:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorCount: this.state.errorCount + 1,
    });

    // Update state with error info
    this.setState((prev) => ({
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // TODO: Send to error tracking service (e.g., Sentry)
    // trackCatastrophicError({
    //   error,
    //   errorInfo,
    //   timestamp: new Date().toISOString(),
    // });
  }

  handleReload = (): void => {
    window.location.href = '/';
  };

  handleHardReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md sm:max-w-xl"
            role="alert"
            aria-live="polite"
            aria-label="Application error"
          >
            {/* Error Container */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Error Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
                  <AlertTriangle className="relative h-16 w-16 text-red-600" />
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
                Something Went Wrong
              </h1>

              {/* Error Description */}
              <p className="text-slate-600 text-center mb-6">
                We're sorry, but something unexpected happened. Our team has been notified and we're
                working to fix it.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <summary className="cursor-pointer font-semibold text-red-900 mb-3">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-semibold text-red-800 mb-1">Error Message:</p>
                      <pre className="bg-white p-2 rounded border border-red-300 overflow-auto max-h-24 whitespace-pre-wrap text-red-700">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="font-semibold text-red-800 mb-1">Component Stack:</p>
                        <pre className="bg-white p-2 rounded border border-red-300 overflow-auto max-h-32 whitespace-pre-wrap text-red-700 text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorCount > 1 && (
                      <div>
                        <p className="font-semibold text-red-800">
                          Error Count: {this.state.errorCount}
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={this.handleReload}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                  aria-label="Go to home page"
                >
                  <Home className="h-5 w-5" />
                  Go to Home
                </button>
                <button
                  onClick={this.handleHardReload}
                  className="w-full px-6 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                  aria-label="Reload the application"
                >
                  <RefreshCw className="h-5 w-5" />
                  Reload Application
                </button>
              </div>

              {/* Support Message */}
              <div className="text-center text-sm text-slate-500 border-t pt-4">
                <p>If the problem persists, please contact support or try again later.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
