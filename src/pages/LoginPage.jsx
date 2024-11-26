import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import '../styles/AuthPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!email || !password) {
      console.error('Email and password are required.');
      setError('Email and password are required.');
      return;
    }

    try {
      const { error } = await loginUser(email, password);
      if (error) {
          setError('Invalid email or password.');
      } else {
          setSuccess('Logged in successfully! Redirecting...');
          setTimeout(() => {
              window.location.href = '/objectives'; // Redirect to the objectives page
          }, 2000);
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
          <h1>Login</h1>
          <p>Welcome! Please login to your account.</p>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleLogin}>
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <p className="redirect-link">
              Create a free account today! <Link to="/register">Register here</Link>.
          </p>
      </div>
  </div>
  </>
  );
}

export default LoginPage;
