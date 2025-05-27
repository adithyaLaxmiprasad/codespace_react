import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

const Title_Update = memo(() => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');

  // Memoized increment function with safety checks
  const incrementCount = useCallback(() => {
    try {
      if (count < Number.MAX_SAFE_INTEGER) {
        setCount(prev => prev + 1);
      }
    } catch (e) {
      setError('Maximum count exceeded');
    }
  }, [count]);

  // Document title update with error handling
  useEffect(() => {
    try {
      document.title = `Clicked ${count} times`;
    } catch (e) {
      setError('Failed to update document title');
      console.error('Title update error:', e);
    }
  }, [count]);

  return (
    <div className="title-update-container">
      <button 
        onClick={incrementCount}
        aria-label="Increment counter"
        className="increment-button"
      >
        Clicks: {count}
      </button>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

// PropTypes for future-proofing
Title_Update.propTypes = {
  initialCount: PropTypes.number
};

export default Title_Update;