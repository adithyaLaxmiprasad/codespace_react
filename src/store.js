import { configureStore } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';

/**
 * Custom error middleware for handling Redux errors
 */
const errorMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Error in Redux action:', err);
    console.error('Action:', action);
    
    // You could dispatch an error action here if needed
    // store.dispatch({ type: 'ERROR_OCCURRED', payload: err.message });
    
    // Rethrow or return based on error handling strategy
    throw err;
  }
};

/**
 * Redux store configuration
 * Combines reducers and applies middleware
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add additional reducers here as the application grows
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(errorMiddleware)
    .concat(process.env.NODE_ENV !== 'production' ? logger : []),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;