
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clinical application error:', error, errorInfo);
    
    // Log clinical context for debugging
    console.error('Error boundary context:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: error.message,
      stack: error.stack
    });

    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Clinical Application Error</h3>
                    <p className="text-sm mt-1">
                      The assessment encountered an unexpected error. Your data has been preserved.
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border text-xs">
                    <p><strong>Error:</strong> {this.state.error?.message}</p>
                    <p className="mt-1 text-gray-600">
                      If this persists, please contact your GP practice IT support.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={this.handleReset}
                      size="sm"
                      className="flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Refresh Page
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
