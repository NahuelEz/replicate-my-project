import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-brand-celeste mb-4">¡Ups! Algo salió mal.</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                Estamos trabajando para solucionarlo. Por favor, intentá recargar la página o volvé más tarde.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-brand-celeste text-white font-bold rounded-lg hover:bg-brand-celeste/90"
            >
                Recargar página
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mt-8 p-4 bg-muted rounded">
                <summary>Detalles del error</summary>
                <pre className="mt-2 whitespace-pre-wrap text-sm">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
