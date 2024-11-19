import { useState } from 'react';
import { registerUser } from '../services/supabaseClient';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password);
      console.log('Registered:', user);
    } catch (error) {
      console.error('Register error:', error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;
