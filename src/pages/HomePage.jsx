import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { fetchAverageRating } from '../services/supabaseClient';

const HomePage = () => {

  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadAverageRating = async () => {
          const avgRating = await fetchAverageRating();
          setAverageRating(avgRating); // Update the average rating
          setLoading(false); // Set loading to false
      };

      loadAverageRating();
  }, []);
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Stay organized!</h1>
          <h5>
            Manage your tasks and objectives with ease.
          </h5><br/>
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
        <br/>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-list-alt"></i>
            <h3>Organize Objectives</h3>
            <p>
              Create, edit, and manage objectives effortlessly.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Set Deadlines</h3>
            <p>
              Never miss a task with deadlines and reminders.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-tags"></i>
            <h3>Group by Category</h3>
            <p>
              Easily group and filter objectives by category or deadline.
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
              <em>This app transformed how I manage my work and personal tasks.<br/>
              I feel more productive than ever!</em>
            </quote></p>
            <strong>- Alex from Florida, USA</strong>
          </div>
          <div className="testimonial-card">
            <p>
              <em>The grouping and deadline features are game-changers. Highly
              recommend it!</em>
            </p>
            <strong>- Greta from Washington D.C., USA</strong>
          </div>
          <div className="testimonial-card">
            <p>
              <em>I love how it is intuitive and easy to use. <br/> It made my
              daily life so much simpler.</em>
            </p>
            <strong>- Michael from New York, USA</strong>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="cta-section">
        <div className="rating-display">
            {loading ? (
                <p>Loading average rating...</p>
            ) : (
              <>
                <h2>Average Rating: {averageRating.toFixed(1)} / 5</h2>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                      <i
                          key={i}
                          className={
                              i < Math.round(averageRating)
                                  ? 'fas fa-star filled'
                                  : 'far fa-star'
                          }
                      ></i>
                  ))}
                </div>
              </>
            )}
        </div>
        <br/><br/>
        <Link to="/register" className="cta-button">
          Get Started for Free
        </Link>
      </footer>
    </div>
  );
};

export default HomePage;
