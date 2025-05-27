import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  const activeStyle = {
    fontWeight: "bold",
    color: "red",
  };

  return (
    <nav style={{ marginBottom: "20px" }}>
      <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} end>
        Home
      </NavLink>{" "}
      |{" "}
      <NavLink to="/about" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        About
      </NavLink>{" "}
      |{" "}
      <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
        Contact
      </NavLink>
    </nav>
  );
}

export default NavBar;
