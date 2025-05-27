import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';
import Home from './Module 4/React Router - Navigation in React/Home';

// Lazy load components
const Counter = React.lazy(() => import('./Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter'));
const Todos = React.lazy(() => import('./Module 4/Redux Toolkit - State Management in React/Todos_Redux/Todos'));
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

// Loading component
const LoadingFallback = () => (
  <div className="loading">Loading component...</div>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <nav className="secondary-nav">
            <Link to="/counter">Counter App</Link>
            <Link to="/todos">Todo App</Link>
          </nav>
          <Suspense fallback={<LoadingFallback />}>
            <main className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/about" element={<About />}>
                  <Route path="subpage" element={<Subpage />} />
                </Route>
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;