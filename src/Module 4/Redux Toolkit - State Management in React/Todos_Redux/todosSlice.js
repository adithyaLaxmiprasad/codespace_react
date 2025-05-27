import { createSlice, nanoid } from '@reduxjs/toolkit';

/**
 * Initial state for the todos feature
 * @typedef {Object} TodosState
 * @property {Array<Todo>} items - Array of todo items
 * @property {string|null} error - Error message if any operation fails
 */

/**
 * @typedef {Object} Todo
 * @property {string} id - Unique identifier
 * @property {string} text - Task description 
 * @property {boolean} completed - Completion status
 * @property {string} createdAt - Creation timestamp
 */

const initialState = {
  items: [],
  error: null
};

/**
 * Redux slice for todo list functionality
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
      
      state.items.push({
        id: nanoid(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
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
      state.items = state.items.filter(todo => !todo.completed);
      state.error = null;
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

export const { addTodo, toggleTodo, removeTodo, clearCompleted, clearError } = todosSlice.actions;

export default todosSlice.reducer;