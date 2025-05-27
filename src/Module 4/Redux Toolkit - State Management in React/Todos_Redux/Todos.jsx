import React, { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, removeTodo, clearCompleted, clearError } from './todosSlice';
import styles from './Todos.module.css';

/**
 * Individual Todo item component (memoized)
 */
const TodoItem = memo(({ todo, onToggle, onRemove }) => {
  return (
    <li className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles.checkbox}
      />
      <span className={styles.todoText}>{todo.text}</span>
      <button 
        onClick={() => onRemove(todo.id)}
        className={styles.removeBtn}
        aria-label="Delete todo"
      >
        ✖
      </button>
    </li>
  );
});

/**
 * Main Todo list application component
 */
const Todos = () => {
  const [newTodo, setNewTodo] = useState('');
  const { items, error } = useSelector(state => state.todos);
  const dispatch = useDispatch();

  // Memoized event handlers for performance
  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  }, [newTodo, dispatch]);

  const handleToggleTodo = useCallback((id) => {
    dispatch(toggleTodo(id));
  }, [dispatch]);

  const handleRemoveTodo = useCallback((id) => {
    dispatch(removeTodo(id));
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  // Clear error message after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className={styles.todosContainer}>
      <h2 className={styles.heading}>Todo List</h2>
      
      {/* Error message display */}
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className={styles.addForm}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className={styles.input}
        />
        <button 
          type="submit" 
          className={styles.addBtn}
          disabled={!newTodo.trim()}
        >
          Add
        </button>
      </form>
      
      {/* Todo list */}
      {items.length > 0 ? (
        <>
          <ul className={styles.todoList}>
            {items.map(todo => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onRemove={handleRemoveTodo}
              />
            ))}
          </ul>
          
          {/* Stats and actions */}
          <div className={styles.stats}>
            <span>{items.filter(todo => !todo.completed).length} items left</span>
            <button 
              onClick={handleClearCompleted}
              className={styles.clearBtn}
              disabled={!items.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </div>
        </>
      ) : (
        <p className={styles.emptyMessage}>No todos yet. Add one above!</p>
      )}
    </div>
  );
};

export default Todos;