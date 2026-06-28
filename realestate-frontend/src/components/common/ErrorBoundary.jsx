import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container my-5 py-5 text-center">
          <div className="card shadow-lg p-5 border-0 rounded-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="text-danger mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <h2 className="fw-bold mb-3">Something went wrong</h2>
            <p className="text-muted mb-4">
              An unexpected error occurred while rendering this page.
            </p>
            <div className="alert alert-light border text-start mb-4 overflow-auto" style={{ maxHeight: '150px', fontSize: '0.85rem' }}>
              <code>{this.state.error && this.state.error.toString()}</code>
            </div>
            <button 
              className="btn btn-primary px-4 py-2 fw-semibold rounded-pill"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
