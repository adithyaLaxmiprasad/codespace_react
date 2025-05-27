import React, { useState, useEffect } from "react";

const Window_Width = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <h2>Window Width Tracker</h2>
      <p>Current window width: {width}px</p>
    </div>
  );
};

export default Window_Width;
