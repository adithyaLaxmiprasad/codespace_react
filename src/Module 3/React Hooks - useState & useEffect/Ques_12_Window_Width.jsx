import React, { useState, useEffect } from "react";

const Window_Width = () => {
  // Safely get initial width (fallback to 0 if window is undefined)
  const getWidth = () =>
    typeof window !== "undefined" && window.innerWidth
      ? window.innerWidth
      : 0;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    if (typeof window === "undefined") {
      // If window is not defined (SSR), skip effect
      return;
    }

    const handleResize = () => {
      try {
        setWidth(window.innerWidth);
      } catch (error) {
        console.error("Error reading window width:", error);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial call in case window resized before event fires
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <h2>Window Width Tracker</h2>
      <p>Current window width: {width}px</p>
    </div>
  );
};

export default Window_Width;
