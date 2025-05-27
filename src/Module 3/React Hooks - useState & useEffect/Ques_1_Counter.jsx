import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Added for type safety

/**
 * Interactive counter component with increment functionality
 * Demonstrates React useState hook with functional updates
 */
const Counter = () => {
  const [count, setCount] = useState(0);

  // Using functional update for state consistency
  const handleIncrement = () => {
    setCount(currentCount => currentCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
};

// Prop type documentation (demonstrates best practice)
Counter.propTypes = {
  // Example for future prop expansion:
  // initialValue: PropTypes.number
};

export default Counter;