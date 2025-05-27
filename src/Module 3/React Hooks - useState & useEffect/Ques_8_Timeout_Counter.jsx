import React, { useState, useEffect } from 'react';

const Timeout_Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set up the interval to increment count every second
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Timeout Counter</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default Timeout_Counter;
