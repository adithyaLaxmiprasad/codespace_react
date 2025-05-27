import React, { useState, useEffect } from "react";

const Title_Update = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Update document title on count change
    document.title = `Clicked ${count} time${count !== 1 ? "s" : ""}`;
  }, [count]);

  return (
    <div>
      <h2>Document Title Update</h2>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Button clicked: {count} time{count !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default Title_Update;
