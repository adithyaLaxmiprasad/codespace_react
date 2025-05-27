import React, { useState, useCallback } from 'react';

function Contact() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = useCallback((email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Simulate async API call
      await new Promise((res) => setTimeout(res, 1000));
      setSubmitted(true);
    } catch {
      setError('Submission failed, please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, validateEmail]);

  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  }, [error]);

  return (
    <div>
      <h1>Contact Us</h1>
      {submitted ? (
        <p>Thank you for contacting us! We will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
            aria-describedby="email-error"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && (
            <p id="email-error" style={{ color: 'red' }} role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default Contact;

// TEST SUGGESTIONS:
// - Test form validation errors appear on invalid input
// - Test successful form submission flow changes UI
// - Test button disabled state while submitting
// - Test error message ARIA role
