import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';
import Home from './Module 4/React Router - Navigation in React/Home';
import styles from './App.module.css';

/**
 * Lazy load components for better performance and code-splitting
 * Each component is loaded only when needed to reduce initial bundle size
 */
const Counter = lazy(() => import(
  /* webpackChunkName: "counter" */
  /* webpackPrefetch: true */
  './Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter'
));

const Todos = lazy(() => import(
  /* webpackChunkName: "todos" */
  /* webpackPrefetch: true */
  './Module 4/Redux Toolkit - State Management in React/Todos_Redux/Todos'
));

const About = lazy(() => import(
  /* webpackChunkName: "about" */
  './Module 4/React Router - Navigation in React/About'
));

const Contact = lazy(() => import(
  /* webpackChunkName: "contact" */
  './Module 4/React Router - Navigation in React/Contact'
));

const Subpage = lazy(() => import(
  /* webpackChunkName: "subpage" */
  './Module 4/React Router - Navigation in React/Subpage'
));

/**
 * Error fallback component for ErrorBoundary
 * Provides user feedback and recovery options when errors occur
 * 
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was caught
 * @param {Function} props.resetErrorBoundary - Function to reset error state
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className={styles.errorContainer} role="alert">
    <h2>Something went wrong</h2>
    <div className={styles.errorDetails}>
      <p className={styles.errorMessage}>{error.message}</p>
      <pre className={styles.errorStack}>{error.stack}</pre>
    </div>
    <div className={styles.errorActions}>
      <button 
        onClick={resetErrorBoundary}
        className={styles.errorButton}
      >
        Try again
      </button>
      <Link to="/" className={styles.errorLink}>
        Return to Home
      </Link>
    </div>
  </div>
);

/**
 * Loading component displayed during lazy component loading
 * Provides visual feedback during component fetching
 */
const LoadingFallback = () => (
  <div className={styles.loadingContainer} aria-live="polite">
    <div className={styles.loadingSpinner}></div>
    <p className={styles.loadingText}>Loading component...</p>
  </div>
);

/**
 * Main App component orchestrating the entire application
 * Handles routing, state management and error boundaries
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  /**
   * Error handler for monitoring and analytics
   * @param {Error} error - The error that occurred
   * @param {Object} errorInfo - React component stack information
   */
  const handleError = (error, errorInfo) => {
    // Log error details for monitoring/debugging
    console.error("Application error:", error);
    console.error("Component stack:", errorInfo?.componentStack);
    
    // In production, we might send to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportErrorToService(error, errorInfo);
    }
  };
  
  /**
   * Handle error boundary reset
   * Clears any cached state that might cause recurring errors
   */
  const handleErrorReset = () => {
    // Clear session storage to ensure fresh state
    sessionStorage.removeItem('lastError');
    console.log("Error boundary has been reset");
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleErrorReset}
    >
      <Provider store={store}>
        <BrowserRouter>
          <div className={styles.appContainer}>
            {/* Main navigation */}
            <NavBar />
            
            {/* Redux examples navigation */}
            <nav className={styles.secondaryNav} aria-label="Redux examples">
              <Link to="/counter" className={styles.navLink}>
                Counter App
              </Link>
              <Link to="/todos" className={styles.navLink}>
                Todo App
              </Link>
            </nav>
            
            {/* Content area with suspense for lazy loading */}
            <Suspense fallback={<LoadingFallback />}>
              <main className={styles.contentContainer}>
                <Routes>
                  {/* Define application routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/counter" element={<Counter />} />
                  <Route path="/todos" element={<Todos />} />
                  <Route path="/about" element={<About />}>
                    {/* Nested route example */}
                    <Route path="subpage" element={<Subpage />} />
                  </Route>
                  <Route path="/contact" element={<Contact />} />
                  {/* Catch-all route redirects to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </Suspense>
            
            {/* Footer area */}
            <footer className={styles.footer}>
              <p>Redux Toolkit Examples - {new Date().getFullYear()}</p>
            </footer>
          </div>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;