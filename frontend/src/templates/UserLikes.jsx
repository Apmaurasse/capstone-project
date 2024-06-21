import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";

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
    <div>
      <h4>Liked Card Backs</h4>
      {cardBacks.length === 0 ? (
        <p>You have not liked any card backs yet.</p>
      ) : (
        <ul>
          {cardBacks.map(cardBack => (
            <li key={cardBack.id}>
              <h5><Link to={`/cardbacks/${cardBack.id}`}>{cardBack.name}</Link></h5>
              <p>{cardBack.text}</p>
              {cardBack.imageUrl && (
                <img src={cardBack.imageUrl} alt={cardBack.name} width="100" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserLikes;
