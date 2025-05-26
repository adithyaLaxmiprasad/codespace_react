import React from 'react';

// Functional component accepting props with a default message
const Ques_1 = ({ message = "Hello, React!" }) => {
  return (
    <div>
      {message}
    </div>
  );
};

export default Ques_1;