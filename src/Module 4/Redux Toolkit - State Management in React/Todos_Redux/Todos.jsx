import React, { useState, useCallback, useRef, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTodo, 
  toggleTodo, 
  removeTodo, 
  updateTodoText,
  setPriority,
  clearCompleted, 
  clearError 
} from './todosSlice';
import styles from './Todos.module.css';

/**
 * Individual Todo item component (memoized for performance)
 * Handles display and actions for a single todo item
 */
const TodoItem = memo(({ todo, onToggle, onRemove, onUpdateText, onSetPriority }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const inputRef = useRef(null);
  
  const handleEdit = () => {
    setIsEditing(true);
    // Focus the input after the state updates
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  
  const handleSave = () => {
    if (editedText.trim() !== todo.text) {
      onUpdateText(todo.id, editedText);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedText(todo.text);
      setIsEditing(false);
    }
  };
  
  const getPriorityClass = () => {
    switch(todo.priority) {
      case 'high': return styles.highPriority;
      case 'low': return styles.lowPriority;
      default: return '';
    }
  };

  return (
    <li className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${getPriorityClass()}`}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles.checkbox}
        aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={styles.editInput}
          data-testid="edit-input"
        />
      ) : (
        <span 
          className={styles.todoText} 
          onDoubleClick={handleEdit}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}
      
      <div className={styles.todoActions}>
        <select
          value={todo.priority || 'normal'}
          onChange={(e) => onSetPriority(todo.id, e.target.value)}
          className={styles.prioritySelect}
          aria-label="Set priority"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        
        <button 
          onClick={() => onRemove(todo.id)}
          className={styles.removeBtn}
          aria-label={`Delete ${todo.text}`}
          title="Delete todo"
        >
          ✖
        </button>
      </div>
    </li>
  );
});

/**
 * Main Todo list application component
 * Manages the todo list UI and interactions with Redux store
 */
const Todos = () => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const { items, error, isLoading } = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
      inputRef.current?.focus();
    }
  }, [newTodo, dispatch]);

  const handleToggleTodo = useCallback((id) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);

  const handleRemoveTodo = useCallback((id) => {
    dispatch(removeTodo(id));
  }, [dispatch]);
  
  const handleUpdateText = useCallback((id, text) => {
    dispatch(updateTodoText({ id, text }));
  }, [dispatch]);
  
  const handleSetPriority = useCallback((id, priority) => {
    dispatch(setPriority({ id, priority }));
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  // Filter todos based on selected filter
  const filteredTodos = useMemo(() => {
    switch(filter) {
      case 'active':
        return items.filter(todo => !todo.completed);
      case 'completed':
        return items.filter(todo => todo.completed);
      default:
        return items;
    }
  }, [items, filter]);

  // Clear error message after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);
  
  // Automatically focus input field on component mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.todosContainer} data-testid="todos-container">
      <h2 className={styles.heading}>Todo List</h2>
      
      {/* Error message display */}
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
          <button 
            onClick={() => dispatch(clearError())}
            className={styles.dismissBtn}
            aria-label="Dismiss error"
          >
            ✖
          </button>
        </div>
      )}
      
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className={styles.addForm}>
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className={styles.input}
          data-testid="new-todo-input"
          maxLength={100}
        />
        <button 
          type="submit" 
          className={styles.addBtn}
          disabled={!newTodo.trim() || isLoading}
          data-testid="add-todo-button"
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>
      
      {/* Filters */}
      <div className={styles.filters}>
        <button 
          onClick={() => setFilter('all')}
          className={`${styles.filterBtn} ${filter === 'all' ? styles.activeFilter : ''}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`${styles.filterBtn} ${filter === 'active' ? styles.activeFilter : ''}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`${styles.filterBtn} ${filter === 'completed' ? styles.activeFilter : ''}`}
        >
          Completed
        </button>
      </div>
      
      {/* Todo list */}
      {filteredTodos.length > 0 ? (
        <>
          <ul className={styles.todoList} data-testid="todo-list">
            {filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onRemove={handleRemoveTodo}
                onUpdateText={handleUpdateText}
                onSetPriority={handleSetPriority}
              />
            ))}
          </ul>
          
          {/* Stats and actions */}
          <div className={styles.stats}>
            <span data-testid="items-left">
              {items.filter(todo => !todo.completed).length} items left
            </span>
            <button 
              onClick={handleClearCompleted}
              className={styles.clearBtn}
              disabled={!items.some(todo => todo.completed)}
              data-testid="clear-completed"
            >
              Clear completed
            </button>
          </div>
        </>
      ) : (
        <p className={styles.emptyMessage} data-testid="empty-message">
          {filter === 'all' 
            ? 'No todos yet. Add one above!'
            : filter === 'active' 
              ? 'No active todos!'
              : 'No completed todos!'}
        </p>
      )}
      
      {/* Help text */}
      <div className={styles.helpText}>
        <p>Double-click a todo to edit it</p>
      </div>
    </div>
  );
};

export default Todos;