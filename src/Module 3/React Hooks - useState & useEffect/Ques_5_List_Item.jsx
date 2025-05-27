import React, { useState } from 'react';

const List_Item = () => {
  const [item, setItem] = useState('');
  const [itemsList, setItemsList] = useState([]);

  const handleAdd = () => {
    const trimmedItem = item.trim();
    if (trimmedItem === '') {
      alert('Item cannot be empty.');
      return;
    }
    setItemsList([...itemsList, trimmedItem]);
    setItem('');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <input
        type="text"
        placeholder="Enter an item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleAdd} style={{ padding: '0.5rem 1rem' }}>
        Add
      </button>

      <ul style={{ marginTop: '1.5rem', listStyleType: 'none' }}>
        {itemsList.map((itm, index) => (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            {itm}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List_Item;