import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/supabaseClient';
import '../styles/AuthPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [message, setMessage] = useState(''); // For displaying the confirmation message
  const [error, setError] = useState(''); // For displaying errors
  const [success, setSuccess] = useState(''); // For displaying success messages

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const { response } = await registerUser(email, password);

        // Fallback check to avoid destructuring undefined
        const { error } = response || {};
        
        if (error) {
            setError('Registration failed. Please try again.');
        } else {
            setSuccess('Registration successful! Check your email to confirm your account.');
        }
    } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="auth-container">
          <div className="auth-card">
              <h1>Register</h1>
              <p>Create an account to start managing your objectives.</p>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <form onSubmit={handleRegister}>
                  <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                  </div>
                  <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                          type="password"
                          id="password"
                          placeholder="Enter a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                  </div>
                  <button type="submit" className="btn btn-primary">Register</button>
              </form>
              <p className="redirect-link">
                  Already have an account? <Link to="/login">Login here</Link>.
              </p>
          </div>
        </div>
    </>
  );
}

export default RegisterPage;
