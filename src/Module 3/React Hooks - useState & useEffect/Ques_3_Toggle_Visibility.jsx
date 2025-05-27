import React, { useState } from 'react';

const Toggle_Visibility = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMessage = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button onClick={toggleMessage}>
        {isVisible ? 'Hide Message' : 'Show Message'}
      </button>
      {isVisible && <p>The message is now visible!</p>}
    </div>
  );
};

export default Toggle_Visibility;

