import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./Module 4/React Router - Navigation in React/NavBar";
import Home from "./Module 4/React Router - Navigation in React/Home";
import About from "./Module 4/React Router - Navigation in React/About";
import Contact from "./Module 4/React Router - Navigation in React/Contact";
import Subpage from "./Module 4/React Router - Navigation in React/Subpage";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} >
          <Route path="subpage" element={<Subpage />} /> {/* Nested route */}
        </Route>
        <Route path="/contact" element={<Contact />} />
        {/* Redirect unknown paths to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
