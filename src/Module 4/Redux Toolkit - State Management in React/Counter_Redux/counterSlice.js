import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the counter feature
 * @typedef {Object} CounterState
 * @property {number} value - The current counter value
 */
const initialState = {
  value: 0,
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
     * Increments counter by 1
     * @param {CounterState} state - Current state
     */
    increment: (state) => {
      state.value += 1;
    },
    
    /**
     * Decrements counter by 1
     * @param {CounterState} state - Current state
     */
    decrement: (state) => {
      state.value -= 1;
    },
    
    /**
     * Increments counter by specified amount
     * @param {CounterState} state - Current state
     * @param {Object} action - Redux action with payload
     * @param {number} action.payload - Amount to increment by
     */
    incrementByAmount: (state, action) => {
      // Validate that payload is a number
      const amount = Number(action.payload);
      if (isNaN(amount)) {
        console.error('Invalid increment amount provided');
        return;
      }
      state.value += amount;
    },
    
    /**
     * Resets counter to zero
     * @param {CounterState} state - Current state
     */
    resetCounter: (state) => {
      state.value = 0;
    }
  },
});

// Export individual action creators
export const { increment, decrement, incrementByAmount, resetCounter } = counterSlice.actions;

// Export the reducer
export default counterSlice.reducer;