import React, { useState } from 'react';

const Simple_Form = () => {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    alert(`Hello, ${name}!`);
    setName(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '2rem' }}>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Submit
      </button>
    </form>
  );
};

export default Simple_Form;