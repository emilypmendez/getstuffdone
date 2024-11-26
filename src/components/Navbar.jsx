import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../services';

import logo from '/assets/get-stuff-done-logo.png'; // Update the path to your logo file
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout }) => {

  const { user } = useContext(AuthContext); // Get user from context
  console.log('Navbar rendered with user:', user); // Debugging log
  const navigate = useNavigate(); // Initialize navigate

  return (
    <nav className="navbar">
      {/* Logo Link */}
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Logo" style={{ height: '100px', cursor: 'pointer' }} />
      </Link>

      {/* Navbar Links */}
      <ul className="navbar-links">
        {isLoggedIn || user ? (
            <>
              <li>
                <Link to="/objectives">View My Objectives</Link>
              </li>
              <li>
                <Link to="/feedback">Give Feedback</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout()
                    navigate('/login'); // Redirect to the login page after logout
                  }}
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
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
    </nav>
  );
};

export default Navbar;
