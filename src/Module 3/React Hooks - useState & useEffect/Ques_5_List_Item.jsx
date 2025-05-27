import React, { useState } from 'react';

const List_Item = () => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setItems(prevItems => [...prevItems, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleAdd} style={styles.form}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter an item..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Add
        </button>
      </form>
      
      <ul style={styles.list}>
        {items.map((item, index) => (
          <li key={index} style={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '1rem'
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  input: {
    flex: 1,
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#45a049'
    }
  },
  list: {
    listStyle: 'inside',
    paddingLeft: '0',
    margin: '0'
  },
  listItem: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
    ':last-child': {
      borderBottom: 'none'
    }
  }
};

export default List_Item;