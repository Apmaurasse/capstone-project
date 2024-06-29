import React, { useState, useEffect, useContext } from "react";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import CardBackCard from "./CardBackCard";
import CardBackModal from "./CardBackModal";
import "./CardBackList.css"; 

function UserLikes() {
  const { likedCardBacks, collectedCardBacks, likeCardBack, unlikeCardBack, collectCardBack, uncollectCardBack } = useContext(ProjectOmegaContext);
  const [cardBacks, setCardBacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

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

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const handleLike = async (id) => {
    if (likedCardBacks.has(id)) {
      await unlikeCardBack(id);
    } else {
      await likeCardBack(id);
    }
    setCardBacks((prev) => prev.map((card) => (card.id === id ? { ...card, isLiked: !card.isLiked } : card)));
  };

  const handleCollect = async (id) => {
    if (collectedCardBacks.has(id)) {
      await uncollectCardBack(id);
    } else {
      await collectCardBack(id);
    }
    setCardBacks((prev) => prev.map((card) => (card.id === id ? { ...card, isCollected: !card.isCollected } : card)));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card-back-list-container">
      <h4 className="liked-card-backs-header">Liked Card Backs</h4>
      {cardBacks.length === 0 ? (
        <p>You have not liked any card backs yet.</p>
      ) : (
        <div className="card-back-list">
          {cardBacks.map(cardBack => (
            <div
              key={cardBack.id}
              className="card-back-list-item"
              onClick={() => handleCardClick(cardBack)}>

              <CardBackCard
                id={cardBack.id}
                name={cardBack.name}
                imageUrl={cardBack.imageUrl}
                imageSize="small" 
              />
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <CardBackModal
          show={showModal}
          handleCloseModal={handleCloseModal}
          selectedCard={selectedCard}
          handleLike={handleLike}
          handleCollect={handleCollect}
          likedCardBacks={likedCardBacks}
          collectedCardBacks={collectedCardBacks}
        />
      )}
    </div>
  );
}

export default UserLikes;






