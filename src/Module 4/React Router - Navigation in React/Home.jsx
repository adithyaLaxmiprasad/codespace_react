import React from "react";
import { Outlet, Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the Home page of our React Router demo.</p>

      {/* Link to nested subpage */}
      <Link to="about/subpage">Go to About's Subpage</Link>

      {/* Render nested routes if any */}
      <Outlet />
    </div>
  );
}

export default Home;
