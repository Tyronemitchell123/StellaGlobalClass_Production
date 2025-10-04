'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug, Download, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  userId?: string;
}

interface RecoveryStrategy {
  id: string;
  label: string;
  description: string;
  action: () => void | Promise<void>;
  priority: number;
}

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, details: ErrorDetails) => void;
  enableReporting?: boolean;
  showDetails?: boolean;
  recoveryStrategies?: RecoveryStrategy[];
  maxRetries?: number;
}

interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  retryCount: number;
  isRecovering: boolean;
  recoveryAttempts: string[];
}

export class EnhancedErrorBoundary extends Component<
  EnhancedErrorBoundaryProps,
  EnhancedErrorBoundaryState
> {
  private retryTimeouts: NodeJS.Timeout[] = [];
  private errorQueue: ErrorDetails[] = [];

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      retryCount: 0,
      isRecovering: false,
      recoveryAttempts: [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      userId: this.getUserId(),
    };

    this.setState({
      errorInfo,
    });

    // Queue error for batch reporting
    this.errorQueue.push(errorDetails);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorDetails);
    }

    // Report error if enabled
    if (this.props.enableReporting !== false) {
      this.reportError(errorDetails);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Enhanced Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;

    try {
      // Try to get from localStorage or session
      return localStorage.getItem('userId') ||
             sessionStorage.getItem('userId') ||
             'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  private async reportError(errorDetails: ErrorDetails) {
    try {
      // Batch errors and send periodically
      if (this.errorQueue.length >= 5) {
        await this.sendErrorBatch();
      } else {
        // Send individual error after a delay
        setTimeout(() => {
          if (this.errorQueue.length > 0) {
            this.sendErrorBatch();
          }
        }, 5000);
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  private async sendErrorBatch() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send to error reporting service (e.g., Sentry, LogRocket, etc.)
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send error report');
      }
    } catch (error) {
      console.error('Error reporting failed:', error);
      // Re-queue errors for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      console.warn('Max retry attempts reached');
      return;
    }

    this.setState({ isRecovering: true, retryCount: retryCount + 1 });

    // Attempt recovery with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);

    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRecovering: false,
      });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  private handleRecoveryStrategy = async (strategy: RecoveryStrategy) => {
    this.setState(prevState => ({
      recoveryAttempts: [...prevState.recoveryAttempts, strategy.id],
      isRecovering: true,
    }));

    try {
      await strategy.action();
      // If successful, reset error state
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRecovering: false,
      });
    } catch (error) {
      console.error('Recovery strategy failed:', error);
      this.setState({ isRecovering: false });
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleDownloadErrorLog = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorLog = {
      errorId,
      timestamp: new Date().toISOString(),
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    };

    const blob = new Blob([JSON.stringify(errorLog, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${errorId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private getDefaultRecoveryStrategies(): RecoveryStrategy[] {
    return [
      {
        id: 'reload',
        label: 'Reload Page',
        description: 'Refresh the current page to reset the application state',
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        },
        priority: 1,
      },
      {
        id: 'clear-cache',
        label: 'Clear Cache',
        description: 'Clear browser cache and reload',
        action: () => {
          if (typeof window !== 'undefined') {
            // Clear localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // Clear service worker cache if available
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
              });
            }

            window.location.reload();
          }
        },
        priority: 2,
      },
      {
        id: 'go-home',
        label: 'Go to Home',
        description: 'Navigate to the home page',
        action: this.handleGoHome,
        priority: 3,
      },
    ];
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId, isRecovering, recoveryAttempts, retryCount } = this.state;
      const { showDetails = process.env.NODE_ENV === 'development', recoveryStrategies, maxRetries = 3 } = this.props;

      const allRecoveryStrategies = [
        ...this.getDefaultRecoveryStrategies(),
        ...(recoveryStrategies || []),
      ].filter(strategy => !recoveryAttempts.includes(strategy.id));

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white text-xl">Something went wrong</CardTitle>
              <CardDescription className="text-slate-400">
                We encountered an unexpected error. Error ID: <code className="bg-slate-700 px-2 py-1 rounded text-xs">{errorId}</code>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {showDetails && error && (
                <div className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="w-4 h-4 text-red-400" />
                    <h3 className="text-white font-medium">Error Details</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-red-400 font-mono">{error.message}</p>
                    </div>

                    {error.stack && (
                      <details className="group">
                        <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          Stack Trace
                        </summary>
                        <pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap bg-slate-950 p-2 rounded overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </details>
                    )}

                    {errorInfo?.componentStack && (
                      <details className="group">
                        <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" />
                          Component Stack
                        </summary>
                        <pre className="text-xs text-slate-500 mt-2 whitespace-pre-wrap bg-slate-950 p-2 rounded overflow-auto max-h-32">
                          {errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Recovery Strategies */}
              {allRecoveryStrategies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Recovery Options</h3>
                  <div className="grid gap-2">
                    {allRecoveryStrategies
                      .sort((a, b) => a.priority - b.priority)
                      .map((strategy) => (
                        <Button
                          key={strategy.id}
                          onClick={() => this.handleRecoveryStrategy(strategy)}
                          disabled={isRecovering}
                          variant="outline"
                          className="justify-start h-auto p-3 text-left"
                        >
                          <div>
                            <div className="font-medium">{strategy.label}</div>
                            <div className="text-xs text-slate-400 mt-1">{strategy.description}</div>
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {retryCount < maxRetries && (
                  <Button
                    onClick={this.handleRetry}
                    disabled={isRecovering}
                    className="flex-1 min-w-0"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
                    {isRecovering ? 'Retrying...' : `Try Again (${retryCount}/${maxRetries})`}
                  </Button>
                )}

                <Button
                  onClick={this.handleDownloadErrorLog}
                  variant="outline"
                  className="flex-1 min-w-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Log
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 min-w-0"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Recovery Attempts */}
              {recoveryAttempts.length > 0 && (
                <div className="text-xs text-slate-500">
                  Previous recovery attempts: {recoveryAttempts.join(', ')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for programmatic error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    // This would typically integrate with error reporting services
    console.error('Programmatic error:', error, errorInfo);

    // Could dispatch to a global error state or send to monitoring service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  };
}

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<EnhancedErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
