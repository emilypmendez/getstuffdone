import { Link } from 'react-router-dom';

function HomePage() {

  return (
    <div>
      <h1>Welcome to Becoming Your Best Self</h1>
      <p>Get stuff done with this productivity app.</p>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default HomePage;
