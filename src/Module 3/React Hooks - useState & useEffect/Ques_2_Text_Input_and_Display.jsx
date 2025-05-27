import React, { useState } from 'react';

const Text_Input = () => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type something..."
        style={styles.input}
      />
      <div style={styles.displayArea}>
        <h3>Your Input:</h3>
        <p>{inputText || 'Start typing to see your text here...'}</p>
      </div>
    </div>
  );
};

const styles = {
  input: {
    padding: '8px',
    fontSize: '16px',
    marginBottom: '10px',
    width: '300px'
  },
  displayArea: {
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    maxWidth: '500px'
  }
};

export default Text_Input;