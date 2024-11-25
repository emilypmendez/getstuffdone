import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '../services/supabaseClient';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      console.error('Email and password are required.');
      setError('Email and password are required.');
      return;
    }

    try {
      const user = await loginUser(email, password);
      console.log('Logged in user:', user); // Ensure this logs the correct user object.
      if (user) {
        // Proceed with navigation or other logic
        console.log('Login successful: ', user);
        navigate('/objectives'); // Navigate to the objectives page after login
      } else {
        setError('User is undefined after login.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Login failed. Please check your credentials and try again.', err.message);
    }
  };

  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        handleLogin(email, password) ;
      }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
}

export default LoginPage;
