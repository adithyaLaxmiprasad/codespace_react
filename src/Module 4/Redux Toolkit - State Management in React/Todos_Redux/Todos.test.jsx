import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import Todos from './Todos';

// Mock store setup for testing
const setupStore = (initialState = { items: [], error: null, isLoading: false }) => {
  return configureStore({
    reducer: {
      todos: todosReducer
    },
    preloadedState: {
      todos: initialState
    }
  });
};

// Helper function to render with store
const renderWithStore = (ui, initialState) => {
  const store = setupStore(initialState);
  return {
    user: userEvent.setup(),
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
};

describe('Todos Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders empty state correctly', () => {
    renderWithStore(<Todos />);
    
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    expect(screen.getByTestId('new-todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-todo-button')).toBeInTheDocument();
  });
  
  test('adds a new todo when form is submitted', async () => {
    const { user } = renderWithStore(<Todos />);
    
    // Fill and submit the form
    const input = screen.getByTestId('new-todo-input');
    await user.type(input, 'Test todo');
    await user.click(screen.getByTestId('add-todo-button'));
    
    // Check that todo was added
    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(input.value).toBe(''); // Input should be cleared
  });
  
  test('displays error when adding empty todo', async () => {
    const { user } = renderWithStore(<Todos />);
    
    // Submit empty form
    await user.click(screen.getByTestId('add-todo-button'));
    
    // Add button should be disabled for empty input
    expect(screen.getByTestId('add-todo-button')).toBeDisabled();
  });
  
  test('toggles todo completion status', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [{ id: '1', text: 'Test todo', completed: false, createdAt: new Date().toISOString() }],
      error: null,
      isLoading: false
    });
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    // Wait for the state to update
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });
  
  test('removes a todo', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [{ id: '1', text: 'Test todo', completed: false, createdAt: new Date().toISOString() }],
      error: null,
      isLoading: false
    });
    
    await user.click(screen.getByTitle('Delete todo'));
    
    // Todo should be removed
    await waitFor(() => {
      expect(screen.queryByText('Test todo')).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    });
  });
  
  test('clears completed todos', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [
        { id: '1', text: 'Complete task', completed: true, createdAt: new Date().toISOString() },
        { id: '2', text: 'Pending task', completed: false, createdAt: new Date().toISOString() }
      ],
      error: null,
      isLoading: false
    });
    
    await user.click(screen.getByTestId('clear-completed'));
    
    // Only the pending task should remain
    await waitFor(() => {
      expect(screen.queryByText('Complete task')).not.toBeInTheDocument();
      expect(screen.getByText('Pending task')).toBeInTheDocument();
    });
  });
  
  test('filters todos correctly', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [
        { id: '1', text: 'Complete task', completed: true, createdAt: new Date().toISOString() },
        { id: '2', text: 'Pending task', completed: false, createdAt: new Date().toISOString() }
      ],
      error: null,
      isLoading: false
    });
    
    // Test active filter
    await user.click(screen.getByText('Active'));
    expect(screen.queryByText('Complete task')).not.toBeInTheDocument();
    expect(screen.getByText('Pending task')).toBeInTheDocument();
    
    // Test completed filter
    await user.click(screen.getByText('Completed'));
    expect(screen.getByText('Complete task')).toBeInTheDocument();
    expect(screen.queryByText('Pending task')).not.toBeInTheDocument();
    
    // Test all filter
    await user.click(screen.getByText('All'));
    expect(screen.getByText('Complete task')).toBeInTheDocument();
    expect(screen.getByText('Pending task')).toBeInTheDocument();
  });
  
  test('displays error message when it occurs', () => {
    renderWithStore(<Todos />, { 
      items: [], 
      error: 'Test error message',
      isLoading: false
    });
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
  
  test('allows editing a todo by double-clicking', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [{ id: '1', text: 'Original text', completed: false, createdAt: new Date().toISOString() }],
      error: null,
      isLoading: false
    });
    
    // Double-click to edit
    const todoText = screen.getByText('Original text');
    await user.dblClick(todoText);
    
    // Edit input should appear
    const editInput = await screen.findByTestId('edit-input');
    expect(editInput).toBeInTheDocument();
    expect(editInput.value).toBe('Original text');
    
    // Change the text and save
    await user.clear(editInput);
    await user.type(editInput, 'Updated text');
    await user.keyboard('{Enter}');
    
    // Text should be updated
    expect(screen.getByText('Updated text')).toBeInTheDocument();
    expect(screen.queryByText('Original text')).not.toBeInTheDocument();
  });
  
  test('changes todo priority', async () => {
    const { user } = renderWithStore(<Todos />, {
      items: [{ 
        id: '1', 
        text: 'Test todo', 
        completed: false, 
        priority: 'normal',
        createdAt: new Date().toISOString() 
      }],
      error: null,
      isLoading: false
    });
    
    // Change priority
    const prioritySelect = screen.getByLabelText('Set priority');
    await user.selectOptions(prioritySelect, 'high');
    
    // Check that priority was changed
    expect(prioritySelect.value).toBe('high');
  });
  
  test('shows correct count of items left', async () => {
    renderWithStore(<Todos />, {
      items: [
        { id: '1', text: 'Task 1', completed: true, createdAt: new Date().toISOString() },
        { id: '2', text: 'Task 2', completed: false, createdAt: new Date().toISOString() },
        { id: '3', text: 'Task 3', completed: false, createdAt: new Date().toISOString() }
      ],
      error: null,
      isLoading: false
    });
    
    expect(screen.getByTestId('items-left').textContent).toBe('2 items left');
  });
});