import React from "react";
import { Outlet, Link } from "react-router-dom";

function About() {
  return (
    <div>
      <h2>About Page</h2>
      <p>This page describes the About section of the app.</p>
      
      <Link to="subpage">Go to Subpage</Link>

      <Outlet /> {/* Render nested sub-routes here */}
    </div>
  );
}

export default About;
