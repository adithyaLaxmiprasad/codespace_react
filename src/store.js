import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';
import todosReducer from './Module 4/Redux Toolkit - State Management in React/Todos_Redux/todosSlice';

/**
 * Custom error middleware for handling Redux errors
 */
const errorMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Redux Error:', err);
    console.error('Action that caused error:', action);
    
    // You could dispatch an error action here if needed
    return undefined; // Don't propagate the error to avoid app crashes
  }
};

// Configure logger middleware for development only
const logger = createLogger({
  collapsed: true,
  duration: true
});

// Get middleware based on environment
const getMiddleware = () => {
  const middleware = [errorMiddleware];
  
  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }
  
  return middleware;
};

/**
 * Redux store configuration with multiple reducers
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(getMiddleware()),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;