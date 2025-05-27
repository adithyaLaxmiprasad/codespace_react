import React, { useState } from 'react';

const Simple_Form = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted Name: ${name}`);
    setName(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label htmlFor="nameInput" style={styles.label}>
        Enter Your Name:
      </label>
      <input
        type="text"
        id="nameInput"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
        placeholder="John Doe"
      />
      <button type="submit" style={styles.button}>
        Submit
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '300px',
    margin: '2rem auto',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  label: {
    fontWeight: '600',
    fontSize: '1.1rem'
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1976D2'
    }
  }
};

export default Simple_Form;