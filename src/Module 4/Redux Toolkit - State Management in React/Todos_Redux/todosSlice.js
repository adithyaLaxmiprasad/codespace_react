import { createSlice, nanoid } from '@reduxjs/toolkit';

/**
 * Initial state for the todos feature
 * @typedef {Object} TodosState
 * @property {Array<Todo>} items - Array of todo items
 * @property {string|null} error - Error message if any operation fails
 * @property {boolean} isLoading - Loading state flag for async operations
 */

/**
 * @typedef {Object} Todo
 * @property {string} id - Unique identifier
 * @property {string} text - Task description 
 * @property {boolean} completed - Completion status
 * @property {string} createdAt - Creation timestamp
 * @property {string} [priority] - Optional priority level
 */

const initialState = {
  items: [],
  error: null,
  isLoading: false
};

/**
 * Redux slice for todo list functionality
 * Manages all todo operations and related state
 */
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * Adds a new todo item
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with todo text payload
     */
    addTodo: (state, action) => {
      const text = action.payload?.trim();
      
      if (!text) {
        state.error = 'Todo text cannot be empty';
        return;
      }
      
      if (text.length > 100) {
        state.error = 'Todo text must be less than 100 characters';
        return;
      }
      
      state.items.push({
        id: nanoid(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'normal'
      });
      state.error = null;
    },
    
    /**
     * Toggles completion status of a todo
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with todo id payload
     */
    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        state.error = null;
      } else {
        state.error = 'Todo not found';
      }
    },
    
    /**
     * Updates todo text
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with id and text payload
     */
    updateTodoText: (state, action) => {
      const { id, text } = action.payload;
      if (!text?.trim()) {
        state.error = 'Todo text cannot be empty';
        return;
      }
      
      const todo = state.items.find(item => item.id === id);
      if (todo) {
        todo.text = text.trim();
        state.error = null;
      } else {
        state.error = 'Todo not found';
      }
    },
    
    /**
     * Sets todo priority
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with id and priority payload
     */
    setPriority: (state, action) => {
      const { id, priority } = action.payload;
      const todo = state.items.find(item => item.id === id);
      if (todo) {
        todo.priority = priority;
        state.error = null;
      } else {
        state.error = 'Todo not found';
      }
    },
    
    /**
     * Removes a todo item
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with todo id payload
     */
    removeTodo: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
        state.error = null;
      } else {
        state.error = 'Todo not found';
      }
    },
    
    /**
     * Clears all completed todos
     * @param {TodosState} state - Current state
     */
    clearCompleted: (state) => {
      const hasCompleted = state.items.some(todo => todo.completed);
      
      if (hasCompleted) {
        state.items = state.items.filter(todo => !todo.completed);
        state.error = null;
      } else {
        state.error = 'No completed todos to clear';
      }
    },
    
    /**
     * Sets loading state (for async operations)
     * @param {TodosState} state - Current state
     * @param {Object} action - Action with boolean payload
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Clears error state
     * @param {TodosState} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Export actions for use in components
export const { 
  addTodo, 
  toggleTodo, 
  removeTodo, 
  updateTodoText,
  setPriority,
  clearCompleted, 
  setLoading,
  clearError 
} = todosSlice.actions;

// Export reducer for store configuration
export default todosSlice.reducer;