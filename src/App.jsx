import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';
import Home from './Module 4/React Router - Navigation in React/Home';
// Lazy load components for performance
const Counter = React.lazy(() => import('./Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter'));
const About = React.lazy(() => import('./Module 4/React Router - Navigation in React/About'));
const Contact = React.lazy(() => import('./Module 4/React Router - Navigation in React/Contact'));
const Subpage = React.lazy(() => import('./Module 4/React Router - Navigation in React/Subpage'));

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="error-container">
    <h2>Something went wrong:</h2>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/counter" element={<Counter />} />
              <Route path="/about" element={<About />}>
                <Route path="subpage" element={<Subpage />} />
              </Route>
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;