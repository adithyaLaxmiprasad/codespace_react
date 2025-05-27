import todosReducer, { 
  addTodo, 
  toggleTodo, 
  removeTodo, 
  updateTodoText,
  setPriority,
  clearCompleted,
  clearError,
  setLoading
} from './todosSlice';

describe('todos reducer', () => {
  const initialState = {
    items: [],
    error: null,
    isLoading: false
  };

  test('should return the initial state', () => {
    expect(todosReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('addTodo action', () => {
    test('should handle addTodo with valid text', () => {
      const text = 'Test Todo';
      const nextState = todosReducer(initialState, addTodo(text));
      
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].text).toBe(text);
      expect(nextState.items[0].completed).toBe(false);
      expect(nextState.items[0].id).toBeDefined();
      expect(nextState.error).toBeNull();
    });
    
    test('should handle addTodo with empty text', () => {
      const nextState = todosReducer(initialState, addTodo(''));
      
      expect(nextState.items).toHaveLength(0);
      expect(nextState.error).toBe('Todo text cannot be empty');
    });
    
    test('should handle addTodo with text exceeding max length', () => {
      const longText = 'a'.repeat(101);
      const nextState = todosReducer(initialState, addTodo(longText));
      
      expect(nextState.items).toHaveLength(0);
      expect(nextState.error).toBe('Todo text must be less than 100 characters');
    });
  });

  describe('toggleTodo action', () => {
    test('should handle toggleTodo for existing todo', () => {
      const state = {
        items: [{ id: '1', text: 'Test', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, toggleTodo('1'));
      
      expect(nextState.items[0].completed).toBe(true);
      expect(nextState.error).toBeNull();
      
      // Toggle back
      const finalState = todosReducer(nextState, toggleTodo('1'));
      expect(finalState.items[0].completed).toBe(false);
    });
    
    test('should handle toggleTodo for non-existent todo', () => {
      const state = {
        items: [{ id: '1', text: 'Test', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, toggleTodo('999'));
      
      expect(nextState.items[0].completed).toBe(false);
      expect(nextState.error).toBe('Todo not found');
    });
  });

  describe('removeTodo action', () => {
    test('should handle removeTodo for existing todo', () => {
      const state = {
        items: [{ id: '1', text: 'Test', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, removeTodo('1'));
      
      expect(nextState.items).toHaveLength(0);
      expect(nextState.error).toBeNull();
    });
    
    test('should handle removeTodo for non-existent todo', () => {
      const state = {
        items: [{ id: '1', text: 'Test', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, removeTodo('999'));
      
      expect(nextState.items).toHaveLength(1);
      expect(nextState.error).toBe('Todo not found');
    });
  });

  describe('updateTodoText action', () => {
    test('should update text of existing todo', () => {
      const state = {
        items: [{ id: '1', text: 'Original', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(
        state, 
        updateTodoText({ id: '1', text: 'Updated' })
      );
      
      expect(nextState.items[0].text).toBe('Updated');
      expect(nextState.error).toBeNull();
    });
    
    test('should reject empty text update', () => {
      const state = {
        items: [{ id: '1', text: 'Original', completed: false }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(
        state, 
        updateTodoText({ id: '1', text: '' })
      );
      
      expect(nextState.items[0].text).toBe('Original');
      expect(nextState.error).toBe('Todo text cannot be empty');
    });
  });

  describe('setPriority action', () => {
    test('should set priority of existing todo', () => {
      const state = {
        items: [{ id: '1', text: 'Test', completed: false, priority: 'normal' }],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(
        state, 
        setPriority({ id: '1', priority: 'high' })
      );
      
      expect(nextState.items[0].priority).toBe('high');
      expect(nextState.error).toBeNull();
    });
  });

  describe('clearCompleted action', () => {
    test('should remove all completed todos', () => {
      const state = {
        items: [
          { id: '1', text: 'Test 1', completed: true },
          { id: '2', text: 'Test 2', completed: false },
          { id: '3', text: 'Test 3', completed: true }
        ],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, clearCompleted());
      
      expect(nextState.items).toHaveLength(1);
      expect(nextState.items[0].id).toBe('2');
      expect(nextState.error).toBeNull();
    });
    
    test('should set error when no completed todos exist', () => {
      const state = {
        items: [
          { id: '1', text: 'Test 1', completed: false },
          { id: '2', text: 'Test 2', completed: false }
        ],
        error: null,
        isLoading: false
      };
      
      const nextState = todosReducer(state, clearCompleted());
      
      expect(nextState.items).toHaveLength(2);
      expect(nextState.error).toBe('No completed todos to clear');
    });
  });

  describe('other actions', () => {
    test('should handle clearError', () => {
      const state = {
        items: [],
        error: 'Some error',
        isLoading: false
      };
      
      const nextState = todosReducer(state, clearError());
      
      expect(nextState.error).toBeNull();
    });
    
    test('should handle setLoading', () => {
      const state = {
        items: [],
        error: null,
        isLoading: false
      };
      
      const loadingState = todosReducer(state, setLoading(true));
      expect(loadingState.isLoading).toBe(true);
      
      const notLoadingState = todosReducer(loadingState, setLoading(false));
      expect(notLoadingState.isLoading).toBe(false);
    });
  });
});