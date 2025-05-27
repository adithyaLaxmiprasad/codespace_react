import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});