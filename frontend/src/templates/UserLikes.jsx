import React, { useState, useEffect, useContext } from "react";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import CardBackCard from "./CardBackCard";
import "./CardBackList.css"; // Assuming you use the same CSS file for styles

/** UserLikes page.
 *
 * Renders a list of card backs liked by the user.
 *
 * Routed at /user/likes
 *
 * Routes -> UserLikes
 */

function UserLikes() {
  const { likedCardBacks } = useContext(ProjectOmegaContext);
  const [cardBacks, setCardBacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLikedCardBacks() {
      try {
        const cardBackDetails = await Promise.all(
          [...likedCardBacks].map(id => ProjectOmegaApi.getCardBack(id))
        );
        setCardBacks(cardBackDetails);
      } catch (err) {
        console.error("Failed to fetch liked card backs", err);
      } finally {
        setLoading(false);
      }
    }

    getLikedCardBacks();
  }, [likedCardBacks]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card-back-list-container">
      <h4 className="liked-card-backs-header">Liked Card Backs</h4>
      {cardBacks.length === 0 ? (
        <p>You have not liked any card backs yet.</p>
      ) : (
        <div className="card-back-list">
          {cardBacks.map(cardBack => (
            <div key={cardBack.id} className="card-back-list-item">
              <CardBackCard
                id={cardBack.id}
                name={cardBack.name}
                imageUrl={cardBack.imageUrl}
                imageSize="small" // Set image size as required
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserLikes;



