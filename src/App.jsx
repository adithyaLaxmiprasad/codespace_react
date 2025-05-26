import React from 'react';
import Ques_1 from './Module 3/Introduction to ReactJS/Ques_1';

function App() {
  return (
    <div>
      {/* Using default message */}
      <Ques_1 />

      {/* Using custom message passed as a prop */}
      <Ques_1 message="Welcome to React!" />
    </div>
  );
}

export default App;

