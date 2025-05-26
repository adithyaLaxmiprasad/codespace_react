import React from 'react';
import Ques_1 from './Module 3/Introduction to ReactJS/Ques_1';
import Ques_2 from './Module 3/Introduction to ReactJS/Ques_2';
import Greeting from './Module 3/Introduction to ReactJS/Ques_3';
import Profile from './Module 3/Introduction to ReactJS/Ques_5';
import LoginMessage from './Module 3/Introduction to ReactJS/Ques_6';

function App() {
  return (
    <div>
      <Ques_1 />
      <Ques_1 message="Welcome to React!" />
      <Ques_1 
        message="Styled and with children!" 
        style={{ color: 'blue', fontWeight: 'bold' }} 
        className="custom-class"
      >
        <span> - Extra content here</span>
      </Ques_1>
      <Ques_2 />
      <Greeting />
      <Profile name="Amrutha" age={22} />

      {/* Conditional Rendering Component */}
      <LoginMessage isLoggedIn={true} />
      <LoginMessage isLoggedIn={false} />
    </div>
  );
}

export default App;
