import React, { useState } from 'react';

/**
 * A simple counter component that increments by 1 on button click.
 * Uses React's useState hook for state management.
 */
const Counter = () => {
  // Initialize count state with a default value of 0
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* Display the current count value */}
      <p>Count: {count}</p>
      
      {/* Button to increment count by 1 */}
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;