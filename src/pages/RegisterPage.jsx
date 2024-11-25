import { useState } from 'react';
import { supabase } from '../supabase';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For displaying the confirmation message
  const [error, setError] = useState(''); // For displaying errors

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    setMessage(''); // Clear any previous message
    setError(''); // Clear any previous error

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message); // Display error if registration fails
        return;
      }

      // Log data for debugging purposes
      console.log('Signup data:', data);

      // Display success message
      setMessage('Check your email for confirmation.');
      setEmail(''); // Clear the form
      setPassword('');
    } catch (err) {
      console.error('Unexpected error during registration:', err.message);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      {/* Display confirmation or error messages */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegisterPage;
