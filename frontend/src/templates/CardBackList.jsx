import React, { useState, useEffect } from "react";
import ProjectOmegaApi from "../api/api";
import CardBackCard from "./CardBackCard";
import LoadingSpinner from "../common/LoadingSpinner";
import CardBackModal from "./CardBackModal";
import "./CardBackList.css"; // Assuming you have a CSS file for custom styles


function CardBackList() {
  console.debug("CardBackList");

  const [cardBacks, setCardBacks] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(function getCardBacksOnMount() {
    console.debug("CardBackList useEffect getCardBacksOnMount");
    search();
  }, []);

  /** Triggered by search form submit; reloads card backs. */
  async function search() {
    let cardBacks = await ProjectOmegaApi.getCardBacks();
    setCardBacks(cardBacks);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  if (!cardBacks) return <LoadingSpinner />;

  return (
    <div className="card-back-list-container">
      <h4 className="liked-card-backs-header">Gallery</h4>
      <div className="card-back-list">
        {cardBacks.length ? (
          cardBacks.map((c) => (
            <div
              key={c.id}
              className="card-back-list-item"
              onClick={() => handleCardClick(c)}
            >
              <CardBackCard
                id={c.id}
                name={c.name}
                description={c.text}
                imageUrl={c.imageUrl}
                sortCategory={c.sortCategory}
                slug={c.slug}
                imageSize="small" // Pass prop to control image size
              />
            </div>
          ))
        ) : (
          <p>Sorry, no results were found!</p>
        )}
      </div>

      {selectedCard && (
        <CardBackModal
          show={showModal}
          handleCloseModal={handleCloseModal}
          selectedCard={selectedCard}
        />
      )}
    </div>
  );
}

export default CardBackList;




