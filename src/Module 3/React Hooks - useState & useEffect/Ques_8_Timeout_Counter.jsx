import React, { useState, useEffect, useRef } from 'react';

const MAX_COUNT = 1000;

const Timeout_Counter = () => {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current !== null) return; // Prevent multiple intervals

    timerRef.current = setInterval(() => {
      try {
        setCount(prevCount => {
          if (prevCount >= MAX_COUNT) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return prevCount;
          }
          return prevCount + 1;
        });
      } catch (error) {
        console.error('Error incrementing count:', error);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
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
