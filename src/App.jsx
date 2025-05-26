import React from 'react';
import Ques_1 from './Module 3/Introduction to ReactJS/Ques_1';

function App() {
  return (
    <div>
      {/* Using default message */}
      <Ques_1 />

      {/* Using custom message passed as a prop */}
      <Ques_1 message="Welcome to React!" />

      {/* Using custom style and children */}
      <Ques_1 
        message="Styled and with children!" 
        style={{ color: 'blue', fontWeight: 'bold' }} 
        className="custom-class"
      >
        <span> - Extra content here</span>
      </Ques_1>
    </div>
  );
}

export default App;