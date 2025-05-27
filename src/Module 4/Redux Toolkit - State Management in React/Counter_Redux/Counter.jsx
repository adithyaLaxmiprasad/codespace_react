import React, { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, resetCounter } from './counterSlice';
import styles from './Counter.module.css'; // Assuming you have a CSS module for styles

/**
 * Memoized button component to prevent unnecessary re-renders
 */
const CounterButton = memo(({ onClick, children }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
});

/**
 * Counter component that interacts with Redux state
 * Displays counter value and provides controls to modify it
 */
const Counter = () => {
  const [customValue, setCustomValue] = useState('');
  const [error, setError] = useState('');
  
  // Get counter value from Redux store
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // Memoized event handlers to prevent unnecessary re-renders
  const handleIncrement = useCallback(() => {
    try {
      dispatch(increment());
      setError('');
    } catch (err) {
      setError('Failed to increment counter');
      console.error(err);
    }
  }, [dispatch]);

  const handleDecrement = useCallback(() => {
    try {
      dispatch(decrement());
      setError('');
    } catch (err) {
      setError('Failed to decrement counter');
      console.error(err);
    }
  }, [dispatch]);

  const handleAddFive = useCallback(() => {
    try {
      dispatch(incrementByAmount(5));
      setError('');
    } catch (err) {
      setError('Failed to add 5 to counter');
      console.error(err);
    }
  }, [dispatch]);

  const handleCustomIncrement = useCallback(() => {
    try {
      const value = parseInt(customValue);
      if (isNaN(value)) {
        setError('Please enter a valid number');
        return;
      }
      
      // Add validation for reasonable values
      if (value > 1000 || value < -1000) {
        setError('Please enter a value between -1000 and 1000');
        return;
      }
      
      dispatch(incrementByAmount(value));
      setCustomValue('');
      setError('');
    } catch (err) {
      setError('Failed to add custom value');
      console.error(err);
    }
  }, [dispatch, customValue]);

  const handleReset = useCallback(() => {
    try {
      dispatch(resetCounter());
      setError('');
    } catch (err) {
      setError('Failed to reset counter');
      console.error(err);
    }
  }, [dispatch]);

  // Handle Enter key press on input field
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && customValue) {
      handleCustomIncrement();
    }
  }, [customValue, handleCustomIncrement]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Counter: {count}</h2>
      
      {/* Error message display */}
      {error && <p className={styles.error}>{error}</p>}
      
      {/* Main button group */}
      <div className={styles.buttonGroup}>
        <CounterButton onClick={handleIncrement}>Increment</CounterButton>
        <CounterButton onClick={handleDecrement}>Decrement</CounterButton>
        <CounterButton onClick={handleAddFive}>Add 5</CounterButton>
        <CounterButton onClick={handleReset}>Reset</CounterButton>
      </div>
      
      {/* Custom increment section */}
      <div className={styles.customSection}>
        <input
          type="number"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter custom value"
          className={styles.input}
          aria-label="Custom increment value"
        />
        <CounterButton onClick={handleCustomIncrement}>Add Amount</CounterButton>
      </div>
      
      {/* Counter status message */}
      <p className={styles.status}>
        {count > 10 ? '🚀 Going high!' : count < 0 ? '⚠️ Negative territory' : '✓ Normal range'}
      </p>
    </div>
  );
};

export default Counter;