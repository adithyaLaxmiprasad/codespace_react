import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      
      {/* Navigation to nested subpage */}
      <nav>
        <Link to="about/subpage" style={{ color: 'blue', textDecoration: 'underline' }}>
          Go to About's Subpage
        </Link>
      </nav>

      <hr />

      {/* Render nested route here */}
      <Outlet />
    </div>
  );
}

export default Home;
