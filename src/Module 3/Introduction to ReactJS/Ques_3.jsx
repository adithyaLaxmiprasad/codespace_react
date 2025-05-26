import React from 'react';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Greeting component failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong displaying the greeting.</h2>;
    }
    return this.props.children;
  }
}

function Greeting() {
  return (
    <ErrorBoundary>
      <div>
        <h1>Welcome!</h1>
        <p>Thank you for visiting our website.</p>
      </div>
    </ErrorBoundary>
  );
}

export default Greeting;