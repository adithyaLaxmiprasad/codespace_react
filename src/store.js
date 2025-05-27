import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';

/**
 * Custom error middleware for handling and logging Redux errors
 * @param {Object} store - Redux store
 * @returns {Function} Next middleware function
 */
const errorMiddleware = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Redux Error:', err);
    console.error('Action that caused error:', action);
    
    // In production, we might want to report to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportErrorToService(err, { action });
    }
    
    // Optionally dispatch an error action to update UI
    store.dispatch({ 
      type: 'app/error', 
      payload: { 
        message: err.message, 
        actionType: action.type 
      }
    });
    
    // Either rethrow or return based on your error handling strategy
    return undefined; // Don't propagate the error to avoid app crashes
  }
};

/**
 * Logger configuration with customized settings
 */
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: action => action.error ? 'red' : 'blue',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
  },
  predicate: (_, action) => !action.type.includes('@@redux/INIT')
});

/**
 * Environment-specific middleware configuration
 * @returns {Array} Array of middleware functions
 */
const getMiddleware = () => {
  // Base middleware that's included in all environments
  const middleware = [errorMiddleware];
  
  if (process.env.NODE_ENV === 'development') {
    // Development-only middleware
    middleware.push(logger);
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Production-only middleware (e.g., analytics, crash reporting)
    // middleware.push(analyticsMiddleware);
  }
  
  return middleware;
};

/**
 * Redux store configuration
 * Combines reducers and applies environment-specific middleware
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Additional reducers can be added here as application grows
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types when checking for serializability
        ignoredActions: ['app/error'],
      },
    }).concat(getMiddleware()),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export type for TypeScript support if needed
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;