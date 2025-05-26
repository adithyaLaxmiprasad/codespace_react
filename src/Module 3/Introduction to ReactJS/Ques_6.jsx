import React from 'react';
import PropTypes from 'prop-types';

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

// ✅ Add PropTypes validation
LoginMessage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default LoginMessage;
