import { useState, useEffect } from "react";
import "../styles/RatingSystem.css";
import { submitRating, fetchRatings } from "../services/supabaseClient";

const RatingSystem = () => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    // Fetch ratings from the backend
    const loadRatings = async () => {
      const { average, total } = await fetchRatings();
      setAverageRating(average);
      setTotalRatings(total);
    };

    loadRatings();
  }, []);

  const handleRating = async (rating) => {
    setUserRating(rating);
    alert(`You rated this product ${rating} stars!`);

    // Submit the rating to the backend
    const success = await submitRating(rating);
    if (success) {
      // Update the average and total ratings
      const { average, total } = await fetchRatings();
      setAverageRating(average);
      setTotalRatings(total);
    }
  };

  return (
    <div className="rating-system">
      <h2>Rate Our Product</h2>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= userRating ? "filled" : ""}`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="rating-info">
        <p>Average Rating: <strong>{averageRating}</strong></p>
        <p>Total Ratings: <strong>{totalRatings}</strong></p>
      </div>
    </div>
  );
};

export default RatingSystem;
