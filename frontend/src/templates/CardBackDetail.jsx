import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import "./CardBackDetail.css"; // Import CSS file for custom styles

/** CardBack Detail page.
 *
 * Renders information about a card back.
 * 
 * Routed at /cardbacks/:id
 *
 * Routes -> CardBackDetail 
 */

function CardBackDetail() {
  const { id } = useParams();
  console.debug("CardBackDetail", "id=", id);

  const [cardBack, setCardBack] = useState(null);
  const { likeCardBack, unlikeCardBack, likedCardBacks, collectCardBack, uncollectCardBack, collectedCardBacks } = useContext(ProjectOmegaContext);

  useEffect(function getCardBackForUser() {
    async function getCardBack() {
      setCardBack(await ProjectOmegaApi.getCardBack(id));
    }

    getCardBack();
  }, [id]);

  if (!cardBack) return <LoadingSpinner />;

  const handleLike = async () => {
    if (likedCardBacks.has(Number(id))) {  // Ensure ID is a number
      await unlikeCardBack(Number(id));
    } else {
      await likeCardBack(Number(id));
    }
  };

  const handleCollect = async () => {
    if (collectedCardBacks.has(Number(id))) {  // Ensure ID is a number
      await uncollectCardBack(Number(id));
    } else {
      await collectCardBack(Number(id));
    }
  };

  return (
    <div className="card-back-detail-container">
      <h4>{cardBack.name}</h4>
      <p>{cardBack.text}</p>
      <div className="image-container">
        <img src={cardBack.imageUrl} alt={cardBack.name} className="card-back-image" />
        <div className="overlay">
          <button className="overlay-button" onClick={handleLike}>
            {likedCardBacks.has(Number(id)) ? "Unlike" : "Like"}
          </button>
          <button className="overlay-button" onClick={handleCollect}>
            {collectedCardBacks.has(Number(id)) ? "Remove from Collection" : "Add to Collection"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardBackDetail;




