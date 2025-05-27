import React, { useState, useEffect, useRef } from "react";

const isValidColor = (color) => {
  // Create a temporary div to test color validity
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
};

const Favorite_Color = () => {
  const [inputValue, setInputValue] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setError("");

    // Debounce the validation and state update by 300ms
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (val.trim() === "") {
        setFavoriteColor("");
        setError("");
        return;
      }

      if (isValidColor(val)) {
        setFavoriteColor(val);
        setError("");
      } else {
        setFavoriteColor("");
        setError("Please enter a valid CSS color name or hex code.");
      }
    }, 300);
  };

  return (
    <div>
      <h2>Enter your favorite color:</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="e.g., red or #FF0000"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && favoriteColor && (
        <p>
          Your favorite color is:{" "}
          <span style={{ color: favoriteColor }}>{favoriteColor}</span>
        </p>
      )}
    </div>
  );
};

export default Favorite_Color;
