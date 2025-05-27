import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './counterSlice';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Counter: {count}</h2>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button style={styles.button} onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <button 
          style={styles.button} 
          onClick={() => dispatch(incrementByAmount(5))}
        >
          Add 5
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  },
};

export default Counter;