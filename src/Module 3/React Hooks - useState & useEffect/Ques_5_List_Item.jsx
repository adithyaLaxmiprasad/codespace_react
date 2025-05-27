import React, { useState } from 'react';
import './List_Item.css'; // CSS module for styling

const List_Item = () => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter an item');
      return;
    }

    setItems(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: inputValue.trim() }
    ]);
    setInputValue('');
    setError('');
  };

  return (
    <div className="list-container">
      <form onSubmit={handleAdd} className="list-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          placeholder="Enter an item..."
          className={`list-input ${error ? 'error' : ''}`}
        />
        <button type="submit" className="list-button">
          Add
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <ul className="item-list">
        {items.map(item => (
          <li key={item.id} className="list-item">
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List_Item;