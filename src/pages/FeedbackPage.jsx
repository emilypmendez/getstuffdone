import { useState } from 'react';
import { supabase } from '../supabase'; // Adjust to your setup
import '../styles/FeedbackPage.css'; // Optional styling

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // 0 - 5 scale
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim() || rating === 0) {
      setErrorMessage('Please provide feedback and a rating.');
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser(); // Get logged-in user
      const userEmail = user?.email || email; // Use user's email or entered email

      const { error } = await supabase
        .from('feedback') // Ensure this table exists
        .insert([
          {
            email: userEmail,
            feedback: feedback.trim(),
            rating,
          },
        ]);

      if (error) throw error;

      setFeedback('');
      setRating(0);
      setEmail('');
      setSuccessMessage('Thank you for your feedback! We will be in touch with you soon.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error.message);
      setErrorMessage('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-page">
      <h1>We Value Your Feedback!</h1>
      <p>Help us improve by sharing your thoughts and experiences with our app.</p>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Your Email (optional)</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Feedback Field */}
        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            placeholder="Share your thoughts..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>

        {/* Rating Field */}
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value="0">Select a rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
