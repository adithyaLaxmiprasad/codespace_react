import React, { useState, useEffect } from "react";

const Window_Width = () => {
  // Safely get initial width (fallback 0 if window undefined)
  const getWidth = () =>
    typeof window !== "undefined" && window.innerWidth
      ? window.innerWidth
      : 0;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth((prevWidth) => (prevWidth !== currentWidth ? currentWidth : prevWidth));
    };

    window.addEventListener("resize", handleResize);

    // No immediate setWidth call here; initial state already set.

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
