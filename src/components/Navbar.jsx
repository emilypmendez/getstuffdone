import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../services';

import logo from '/assets/get-stuff-done-logo.png'; // Update the path to your logo file
import { logoutUser } from '../services/supabaseClient';
import { supabase } from '../supabase';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useContext(AuthContext); // Get user from context
  console.log('Navbar rendered with user:', user); // Debugging log
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      console.log('Session:', session); // Debugging log
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
        navigate('/login'); // Redirect to the login page
      } catch (err) {
        console.error('Error during logout:', err.message);
        alert('Failed to log out. Please try again.');
      }
    }
  };

  return (
    <nav className="navbar">
      {/* Logo Link */}
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Logo" style={{ height: '100px', cursor: 'pointer' }} />
      </Link>

      {/* Navbar Links */}
      <ul className="navbar-links">
        {!isLoggedIn ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/objectives">Objectives</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'blue',
                    fontSize: 'inherit',
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
    </nav>
  );
};

export default Navbar;
