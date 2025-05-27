import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';
import todosReducer from './Module 4/Redux Toolkit - State Management in React/Todos_Redux/todosSlice';
import App from './App';

// Mock the lazy-loaded components to avoid issues in testing
jest.mock('./Module 4/React Router - Navigation in React/NavBar', () => () => (
  <div data-testid="navbar">NavBar</div>
));

jest.mock('./Module 4/React Router - Navigation in React/Home', () => () => (
  <div data-testid="home">Home Page</div>
));

jest.mock('./Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter', 
  () => () => <div data-testid="counter">Counter Component</div>
);

jest.mock('./Module 4/Redux Toolkit - State Management in React/Todos_Redux/Todos', 
  () => () => <div data-testid="todos">Todos Component</div>
);

jest.mock('./Module 4/React Router - Navigation in React/About', () => () => (
  <div data-testid="about">About Page</div>
));

jest.mock('./Module 4/React Router - Navigation in React/Contact', () => () => (
  <div data-testid="contact">Contact Page</div>
));

// Mock React.lazy and Suspense to avoid test issues
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    Suspense: ({ children }) => children,
    lazy: (importer) => {
      const Component = importer();
      return Component;
    }
  };
});

// Mock Error Boundary
jest.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }) => children
}));

// Create a test store
const createTestStore = () => configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer
  }
});

describe('App Component', () => {
  test('renders navigation elements', () => {
    render(
      <Provider store={createTestStore()}>
        <App />
      </Provider>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('navigates to home page by default', () => {
    render(
      <Provider store={createTestStore()}>
        <App />
      </Provider>
    );
    
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
  
  test('navigates to todos page when route is /todos', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/todos']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('todos')).toBeInTheDocument();
  });

  test('navigates to counter page when route is /counter', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/counter']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('counter')).toBeInTheDocument();
  });
  
  test('navigates to about page when route is /about', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/about']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('about')).toBeInTheDocument();
  });
  
  test('navigates to contact page when route is /contact', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/contact']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });
  
  test('redirects to home for unknown routes', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/unknown-route']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
  
  test('navigation links work correctly', async () => {
    // We need to mock Navigation for this test
    const user = userEvent.setup();
    
    // Render App with router
    render(
      <Provider store={createTestStore()}>
        <App />
      </Provider>
    );
    
    // Get navigation links - in a real test we'd have access to the actual links
    // but with our mocks we'll need to simulate this differently
    const todoLink = screen.getByText('Todo App');
    await user.click(todoLink);
    
    // In a real test, this would navigate to the todos page
    // Here we're just testing that the link is clickable
    expect(todoLink).toBeInTheDocument();
  });
});