import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

class NavBarErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("NavBar error:", error);
  }
  render() {
    if (this.state.hasError) {
      return <div role="alert">Navigation failed to load.</div>;
    }
    return this.props.children;
  }
}

const NavBar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'red',
    textDecoration: 'underline',
  };

  return (
    <nav aria-label="Main navigation" style={{ marginBottom: 20 }}>
      <NavLink to="/" end style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Home
      </NavLink>{' '}
      |{' '}
      <NavLink to="/about" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        About
      </NavLink>{' '}
      |{' '}
      <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Contact
      </NavLink>
    </nav>
  );
};

export default memo(function WrappedNavBar() {
  return (
    <NavBarErrorBoundary>
      <NavBar />
    </NavBarErrorBoundary>
  );
});

// TEST SUGGESTIONS:
// - Test NavBar renders correct active links per route
// - Test NavBar error boundary fallback on error
