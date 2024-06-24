import React, { useState, useEffect, useContext } from "react";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import CardBackCard from "./CardBackCard";
import "./CardBackList.css"; // Assuming you use the same CSS file for styles

/** UserCollection page.
 *
 * Renders a list of card backs collected by the user.
 *
 * Routed at /user/collection
 *
 * Routes -> UserCollection
 */

function UserCollection() {
  const { collectedCardBacks } = useContext(ProjectOmegaContext);
  const [cardBacks, setCardBacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCollectedCardBacks() {
      try {
        const cardBackDetails = await Promise.all(
          [...collectedCardBacks].map(id => ProjectOmegaApi.getCardBack(id))
        );
        setCardBacks(cardBackDetails);
      } catch (err) {
        console.error("Failed to fetch collected card backs", err);
      } finally {
        setLoading(false);
      }
    }

    getCollectedCardBacks();
  }, [collectedCardBacks]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card-back-list-container">
      <h4 className="collected-card-backs-header">Collected Card Backs</h4>
      {cardBacks.length === 0 ? (
        <p>You have not collected any card backs yet.</p>
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

export default UserCollection;
