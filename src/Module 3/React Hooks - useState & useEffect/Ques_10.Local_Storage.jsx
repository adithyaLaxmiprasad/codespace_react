import React, { useState, useEffect } from "react";

const Local_Storage = () => {
  // Safe retrieval of localStorage item with error handling
  const getLocalStorage = (key) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? storedValue : "";
    } catch (error) {
      console.warn("localStorage access failed:", error);
      return ""; // fallback value
    }
  };

  const [input, setInput] = useState(() => getLocalStorage("userInput"));

  useEffect(() => {
  try {
    const storedValue = localStorage.getItem("userInput") || "";
    if (input !== storedValue) {
      localStorage.setItem("userInput", input);
    }
  } catch (error) {
    console.warn("Saving to localStorage failed:", error);
  }
}, [input]);


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
