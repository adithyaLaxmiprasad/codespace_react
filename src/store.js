import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';
import todosReducer from './Module 4/Redux Toolkit - State Management in React/Todos_Redux/todosSlice';

/**
 * Custom error middleware for handling and logging Redux errors
 * Handles any exceptions that occur during the dispatch process
 * 
 * @param {Object} store - Redux store instance
 * @returns {Function} Next middleware function
 */
const errorMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    // Detailed error logging for debugging
    console.error('Redux Error:', err);
    console.error('Action that caused error:', action);
    console.error('Current state:', store.getState());
    
    // In production, you might want to report to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportToErrorService(err, { action, state: store.getState() });
    }
    
    // Dispatch an error action to update UI with error information
    store.dispatch({ 
      type: 'app/error', 
      payload: { 
        message: err.message, 
        actionType: action.type,
        timestamp: new Date().toISOString() 
      }
    });
    
    // Return undefined to prevent error propagation
    return undefined;
  }
};

/**
 * Performance monitoring middleware
 * Tracks how long actions take to process
 */
const performanceMiddleware = () => next => action => {
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  const duration = end - start;
  
  // Log slow actions for performance tuning
  if (duration > 100) {
    console.warn(`Slow action: ${action.type} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};

/**
 * Analytics middleware to track user actions
 * Only used in production to avoid unnecessary data collection
 */
const analyticsMiddleware = () => next => action => {
  if (process.env.NODE_ENV === 'production') {
    // Example: Analytics tracking for important actions
    if (action.type.startsWith('todos/')) {
      // Example: trackEvent('redux', action.type);
    }
  }
  return next(action);
};

/**
 * Configure Redux Logger with custom settings for development
 */
const logger = createLogger({
  collapsed: true,      // Collapse log groups by default
  duration: true,       // Print the duration of each action
  timestamp: true,      // Print the timestamp of each action
  colors: {
    title: action => action.error ? 'red' : 'blue',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50'
  },
  predicate: (_, action) => !action.type.includes('@@redux/INIT')
});

/**
 * Environment-specific middleware configuration
 * Allows for different middleware setups based on environment
 * 
 * @returns {Array} Array of configured middleware functions
 */
const getMiddleware = () => {
  // Base middleware used in all environments
  const middleware = [errorMiddleware, performanceMiddleware];
  
  if (process.env.NODE_ENV === 'development') {
    // Development-only middleware
    middleware.push(logger);
  } else {
    // Production-only middleware
    middleware.push(analyticsMiddleware);
  }
  
  return middleware;
};

/**
 * Local storage persistence middleware
 * Saves and loads state from localStorage for persistence
 */
const persistMiddleware = store => next => action => {
  const result = next(action);
  
  // Save todos to localStorage after state changes
  if (action.type.startsWith('todos/')) {
    const { todos } = store.getState();
    localStorage.setItem('todos', JSON.stringify(todos.items));
  }
  
  return result;
};

/**
 * Load persisted state from localStorage
 */
const loadPersistedState = () => {
  try {
    const persistedTodos = localStorage.getItem('todos');
    if (persistedTodos) {
      return {
        todos: {
          items: JSON.parse(persistedTodos),
          error: null,
          isLoading: false
        }
      };
    }
  } catch (err) {
    console.error('Failed to load persisted state:', err);
  }
  return undefined;
};

/**
 * Redux store configuration
 * Central state container for the application
 */
export const store = configureStore({
  // Combine reducers from different features
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  },
  
  // Load persisted state if available
  preloadedState: loadPersistedState(),
  
  // Configure middleware with environment-specific settings
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types for serializability check
        ignoredActions: ['app/error'],
      },
    })
    .concat(getMiddleware())
    .concat(persistMiddleware),
  
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;