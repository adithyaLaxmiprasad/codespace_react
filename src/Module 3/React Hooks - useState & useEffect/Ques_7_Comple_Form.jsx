import React, { useReducer } from 'react';

const initialState = {
  username: '',
  email: '',
  password: '',
  errors: {}
};

function reducer(state, action) {
  switch (action.type) {
    case 'FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' } // Clear specific error on change
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const Complex_Form = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { username, email, password, errors } = state;
  const [submittedData, setSubmittedData] = React.useState(null);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }
    setSubmittedData({ username, email, password });
    dispatch({ type: 'RESET' });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) =>
              dispatch({ type: 'FIELD', field: 'username', value: e.target.value })
            }
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              dispatch({ type: 'FIELD', field: 'email', value: e.target.value })
            }
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) =>
              dispatch({ type: 'FIELD', field: 'password', value: e.target.value })
            }
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Register
        </button>
      </form>

      {submittedData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Submitted Data:</h3>
          <p><strong>Username:</strong> {submittedData.username}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Password:</strong> {submittedData.password}</p>
        </div>
      )}
    </div>
  );
};

export default Complex_Form;
