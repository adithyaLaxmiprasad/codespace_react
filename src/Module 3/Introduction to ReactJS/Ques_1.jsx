import React from 'react';

function Ques_1({ message = "Hello from Ques_1!", style, className, children }) {
  return (
    <div style={style} className={className}>
      {message}
      {children}
    </div>
  );
}

export default Ques_1;