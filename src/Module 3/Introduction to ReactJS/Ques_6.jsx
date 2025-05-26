import React from 'react';

const LoginMessage = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? (
        <h2>Welcome back, user!</h2>
      ) : (
        <h2>Please log in to continue.</h2>
      )}
    </div>
  );
};

export default LoginMessage;

