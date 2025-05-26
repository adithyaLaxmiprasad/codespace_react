import React from 'react';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Component error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Renamed from Error to SyntaxDemo to better reflect its purpose
function SyntaxDemo() {
    return (
        <ErrorBoundary>
            <div>
                <h1>Unclosed tag</h1>
                <p>Self-closing tag example <img src="example.png" /></p>
                <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                </ul>
            </div>
        </ErrorBoundary>
    );
}

export default SyntaxDemo;