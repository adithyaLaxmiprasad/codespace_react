import React, { Suspense, lazy } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Subpage = lazy(() => import('./Subpage'));

function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our application.</p>

      <nav>
        <Link to="subpage" style={{ marginRight: 10 }}>Subpage</Link>
        <Link to="/">Home</Link>
      </nav>

      <hr />

      <Suspense fallback={<div>Loading subpage...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default About;

// TEST SUGGESTIONS:
// - Test links navigate correctly
// - Test subpage lazy loading works (renders fallback first)
// - Test Outlet renders nested content
