import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';
import Home from './Module 4/React Router - Navigation in React/Home';

/**
 * Lazy load components to improve initial load time
 * Each import is set to a separate chunk with chunk naming for better debugging
 */
const Counter = React.lazy(() => import(
  /* webpackChunkName: "counter" */
  /* webpackPrefetch: true */
  './Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter'
));
const About = React.lazy(() => import(/* webpackChunkName: "about" */ './Module 4/React Router - Navigation in React/About'));
const Contact = React.lazy(() => import(/* webpackChunkName: "contact" */ './Module 4/React Router - Navigation in React/Contact'));
const Subpage = React.lazy(() => import(/* webpackChunkName: "subpage" */ './Module 4/React Router - Navigation in React/Subpage'));

/**
 * Loading component displayed during lazy loading
 */
const LoadingFallback = () => (
  <div className="loading" role="alert" aria-busy="true">
    <div className="spinner"></div>
    <p>Loading application...</p>
  </div>
);

/**
 * Error fallback component for handling runtime errors
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was caught
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-container" role="alert">
    <h2>Something went wrong</h2>
    <p>Error: {error.message}</p>
    <pre>{error.stack}</pre>
    <button onClick={resetErrorBoundary}>
      Try again
    </button>
  </div>
);

/**
 * Main App component that sets up routing and global providers
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // Function to handle errors from ErrorBoundary
  const handleError = (error, errorInfo) => {
    // Log to error monitoring service in production
    console.error("Application error:", error);
    console.error("Component stack:", errorInfo?.componentStack);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Optional: Additional cleanup when error boundary resets
        console.log("Error boundary has been reset");
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Suspense fallback={<LoadingFallback />}>
            <main className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/about" element={<About />}>
                  <Route path="subpage" element={<Subpage />} />
                </Route>
                <Route path="/contact" element={<Contact />} />
                {/* Catch-all route for 404 handling */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;