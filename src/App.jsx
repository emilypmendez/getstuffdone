import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ObjectivesPage from './pages/ObjectivesPage';
import Navbar from './components/Navbar';

import { AuthProvider } from './services/index';
import { supabase } from './supabase';
import { logoutUser } from './services/supabaseClient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in on component mount
  useEffect(() => {
    console.log('Checking session...'); // Debugging log
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      console.log('Get Session:', session, !!session?.user); // Debugging log
      setIsLoggedIn(!!session?.user); // Check if the user is logged in
    };

    checkSession();
  }, []);

  console.log('Is user logged in?', isLoggedIn); // Log the state after rendering

  // Ensure session persistence
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session, error } = await supabase.auth.refreshSession();
        console.log('Session after refresh:', session, !!session?.user); // Debugging log
        if (error) throw error;
        setIsLoggedIn(!!session?.user);
      } catch (error) {
        console.error('Error refreshing session:', error.message);
      }
    };
  
    checkSession();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logoutUser(); // Log out the user
        setIsLoggedIn(false); // Reset the logged-in state
      } catch (err) {
        console.error('Error during logout:', err.message);
        alert('Failed to log out. Please try again.');
      }
    }
  };

  return (
    <>
    <AuthProvider>
      <Router>
        <div>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout}/> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/objectives" element={ <ObjectivesPage /> } />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;
