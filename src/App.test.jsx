import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';
import App from './App';

// Mock the lazy-loaded components to avoid issues in testing
jest.mock('./Module 4/React Router - Navigation in React/NavBar', () => () => <div data-testid="navbar">NavBar</div>);
jest.mock('./Module 4/React Router - Navigation in React/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('./Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter', 
  () => () => <div data-testid="counter">Counter Component</div>
);

// Create a test store
const createTestStore = () => configureStore({
  reducer: { counter: counterReducer }
});

describe('App Component', () => {
  test('renders navbar and home page by default', () => {
    render(
      <Provider store={createTestStore()}>
        <App />
      </Provider>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  test('navigates to counter page', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/counter']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('counter')).toBeInTheDocument();
  });

  test('handles error boundary correctly', () => {
    // Mock a component that throws an error
    jest.mock('./Module 4/React Router - Navigation in React/About', 
      () => () => { throw new Error('Test error'); }
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/about']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});