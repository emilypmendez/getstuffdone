import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Get Stuff Done - Fast!</h1>
          <h5>
            Simplify your life with an intuitive task manager designed to help
            you stay organized and productive.
          </h5>
          <Link to="/register" className="cta-button">
            <strong>Register Now</strong>
          </Link>
        </div>
        <img
          src="/assets/task-manager.png"
          alt="Hero"
          className="hero-image"
          style={{ width: "25%", justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
        />
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our App?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-list-alt"></i>
            <h3>Organize Objectives</h3>
            <p>
              Create, edit, and manage objectives effortlessly. Track your
              progress and stay focused.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Set Deadlines</h3>
            <p>
              Never miss a task with deadlines and reminders. Prioritize your
              work like a pro.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-tags"></i>
            <h3>Group by Category</h3>
            <p>
              Easily group and filter objectives by category or deadline for
              better organization.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p><quote>
              This app transformed how I manage my work and personal tasks.<br/>
              I feel more productive than ever!
            </quote></p>
            <strong>- Alex Johnson</strong>
          </div>
          <div className="testimonial-card">
            <p>
              "The grouping and deadline features are game-changers. Highly
              recommend it!"
            </p>
            <strong>- Priya Sharma</strong>
          </div>
          <div className="testimonial-card">
            <p>
              "I love how intuitive and easy to use this app is. <br/> It has made my
              daily life so much simpler."
            </p>
            <strong>- Michael Chen</strong>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="cta-section">
        <h2>Ready to Take Control of Your Tasks?</h2>
        <Link to="/register" className="cta-button">
          Get Started for Free
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
