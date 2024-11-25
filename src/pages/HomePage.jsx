import { Link } from 'react-router-dom';

function HomePage() {

  return (
    <div>
      <br/>
      <h1>Welcome to Becoming Your Best Self</h1>
      <p>Get stuff done with this productivity app. Click below to register your account and get started!</p><br/>
      <center><Link to="/register" className="btn btn-primary btn-lg"><strong>Register Now</strong></Link></center>
    </div>
  );
}

export default HomePage;
