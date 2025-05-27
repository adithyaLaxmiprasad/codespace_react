import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';

// Lazy load components for better performance
const Home = lazy(() => import('./Module 4/React Router - Navigation in React/Home'));
const About = lazy(() => import('./Module 4/React Router - Navigation in React/About'));
const Contact = lazy(() => import('./Module 4/React Router - Navigation in React/Contact'));
const Subpage = lazy(() => import('./Module 4/React Router - Navigation in React/Subpage'));

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    // Optional: force page reload or reset error state to retry
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>Please try refreshing the page or come back later.</p>
          <button onClick={this.handleReload}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: 20 }}>Loading content, please wait...</div>}>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="about/subpage" element={<Subpage />} />
            </Route>
            <Route path="/about/*" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

// TEST SUGGESTIONS:
// - Test route rendering for '/', '/about', '/contact', and unknown paths
// - Test error boundary fallback UI on error thrown
// - Test Suspense loading fallback UI
