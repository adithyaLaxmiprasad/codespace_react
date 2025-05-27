import React, { useState } from "react";

const Favorite_Color = () => {
  const [favoriteColor, setFavoriteColor] = useState("");

  const handleChange = (e) => {
    setFavoriteColor(e.target.value);
  };

  return (
    <div>
      <h2>Enter your favorite color:</h2>
      <input
        type="text"
        value={favoriteColor}
        onChange={handleChange}
        placeholder="Type your favorite color"
      />
      <p>Your favorite color is: {favoriteColor || "None selected"}</p>
    </div>
  );
};

export default Favorite_Color;
