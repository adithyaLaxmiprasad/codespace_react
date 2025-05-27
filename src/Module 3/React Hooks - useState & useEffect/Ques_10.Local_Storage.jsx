import React, { useState, useEffect } from "react";

const Local_Storage = () => {
  // Initialize state from localStorage or empty string if none exists
  const [input, setInput] = useState(() => {
    return localStorage.getItem("userInput") || "";
  });

  // Update localStorage whenever input changes
  useEffect(() => {
    localStorage.setItem("userInput", input);
  }, [input]);

  // Handle input change
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <h3>Enter something and it will persist:</h3>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type here..."
      />
      <p>Saved Input: {input}</p>
    </div>
  );
};

export default Local_Storage;
