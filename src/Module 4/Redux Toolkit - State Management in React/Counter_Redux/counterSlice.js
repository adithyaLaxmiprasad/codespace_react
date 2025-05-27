import { createSlice, createAction } from '@reduxjs/toolkit';

/**
 * Constants for the counter module
 */
export const COUNTER_MAX_VALUE = 100;
export const COUNTER_MIN_VALUE = -100;

/**
 * Initial state for the counter feature
 * @typedef {Object} CounterState
 * @property {number} value - The current counter value
 * @property {string|null} error - Error message if any operation fails
 * @property {boolean} isLoading - Loading state for async operations
 */
const initialState = {
  value: 0,
  error: null,
  isLoading: false
};

/**
 * Action to track errors in counter operations
 */
export const counterError = createAction('counter/error');

/**
 * Validates if a number is within acceptable bounds
 * @param {number} value - Value to validate
 * @returns {boolean} Whether the value is valid
 */
const isValidCounterValue = (value) => {
  return !isNaN(value) && value >= COUNTER_MIN_VALUE && value <= COUNTER_MAX_VALUE;
};

/**
 * Redux slice for counter functionality
 * Handles state updates for counter operations
 */
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    /**
     * Increments counter by 1 if not at maximum value
     * @param {CounterState} state - Current state
     */
    increment: (state) => {
      if (state.value < COUNTER_MAX_VALUE) {
        state.value += 1;
        state.error = null;
      } else {
        state.error = `Cannot increment above maximum value (${COUNTER_MAX_VALUE})`;
      }
    },
    
    /**
     * Decrements counter by 1 if not at minimum value
     * @param {CounterState} state - Current state
     */
    decrement: (state) => {
      if (state.value > COUNTER_MIN_VALUE) {
        state.value -= 1;
        state.error = null;
      } else {
        state.error = `Cannot decrement below minimum value (${COUNTER_MIN_VALUE})`;
      }
    },
    
    /**
     * Increments counter by specified amount within valid range
     * @param {CounterState} state - Current state
     * @param {Object} action - Redux action with payload
     * @param {number} action.payload - Amount to increment by
     */
    incrementByAmount: (state, action) => {
      // Validate that payload is a number
      const amount = Number(action.payload);
      
      if (isNaN(amount)) {
        state.error = 'Invalid increment amount provided';
        return;
      }
      
      const newValue = state.value + amount;
      
      // Check if new value would be within bounds
      if (!isValidCounterValue(newValue)) {
        state.error = `Value must be between ${COUNTER_MIN_VALUE} and ${COUNTER_MAX_VALUE}`;
        return;
      }
      
      state.value = newValue;
      state.error = null;
    },
    
    /**
     * Resets counter to zero
     * @param {CounterState} state - Current state
     */
    resetCounter: (state) => {
      state.value = 0;
      state.error = null;
    },
    
    /**
     * Clears any error messages
     * @param {CounterState} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Sets the loading state (for async operations)
     * @param {CounterState} state - Current state
     * @param {Object} action - Redux action with payload
     * @param {boolean} action.payload - Loading state
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

// Export individual action creators
export const { 
  increment, 
  decrement, 
  incrementByAmount, 
  resetCounter,
  clearError,
  setLoading
} = counterSlice.actions;

// Export the reducer
export default counterSlice.reducer;