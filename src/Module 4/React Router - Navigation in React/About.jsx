import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our application.</p>

      {/* Links for nested routes or related pages */}
      <nav>
        <Link to="subpage" style={{ marginRight: 10 }}>Subpage</Link>
        <Link to="/">Home</Link>
      </nav>

      <hr />

      {/* Nested route renders here */}
      <Outlet />
    </div>
  );
}

export default About;
