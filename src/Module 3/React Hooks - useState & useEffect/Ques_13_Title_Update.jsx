import React, { useState, useEffect } from 'react';

const Title_Update = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]); // Dependency array ensures effect runs only when count changes

  return (
    <div style={styles.container}>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        style={styles.button}
      >
        Increment Count ({count})
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem'
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1976D2'
    }
  }
};

export default Title_Update;