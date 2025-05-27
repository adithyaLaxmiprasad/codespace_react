import React, { Suspense, memo } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>

      <nav>
        <Link to="about/subpage" style={{ color: 'blue', textDecoration: 'underline' }}>
          Go to About's Subpage
        </Link>
      </nav>

      <hr />

      <Suspense fallback={<div>Loading nested content...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default memo(Home);

// TEST SUGGESTIONS:
// - Test link navigates properly
// - Test nested routes render with fallback UI
