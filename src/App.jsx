import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Module 4/React Router - Navigation in React/NavBar';

// Lazy load components for better performance
const Home = lazy(() => import('./Module 4/React Router - Navigation in React/Home'));
const About = lazy(() => import('./Module 4/React Router - Navigation in React/About'));
const Contact = lazy(() => import('./Module 4/React Router - Navigation in React/Contact'));
const Subpage = lazy(() => import('./Module 4/React Router - Navigation in React/Subpage'));

// ErrorBoundary component for catching rendering errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try refreshing the page.</h2>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} >
              <Route path="about/subpage" element={<Subpage />} />
            </Route>
            <Route path="/about/*" element={<About />}/>
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
