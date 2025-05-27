import React, { useState, useEffect } from 'react';

const MAX_COUNT = 1000;

const Timeout_Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        setCount(prevCount => {
          if (prevCount >= MAX_COUNT) {
            clearInterval(timer);
            return prevCount;
          }
          return prevCount + 1;
        });
      } catch (error) {
        console.error('Error incrementing count:', error);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Timeout Counter</h2>
      <p>Count: {count}</p>
      {count >= MAX_COUNT && <p>Max count reached.</p>}
    </div>
  );
};

export default Timeout_Counter;
