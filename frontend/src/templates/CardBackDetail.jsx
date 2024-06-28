import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./CardBackDetail.css"; 

function CardBackDetail({ id, show, handleClose }) {
  const [cardBack, setCardBack] = useState(null);
  const { likeCardBack, unlikeCardBack, likedCardBacks, collectCardBack, uncollectCardBack, collectedCardBacks } = useContext(ProjectOmegaContext);

  useEffect(() => {
    async function getCardBackForUser() {
      try {
        const cardBackData = await ProjectOmegaApi.getCardBack(id);
        setCardBack(cardBackData);
      } catch (error) {
        console.error("Failed to fetch card back", error);
      }
    }

    if (id) {
      getCardBackForUser();
    }
  }, [id]);

  if (!cardBack) return <LoadingSpinner />;

  const handleLike = async () => {
    try {
      if (likedCardBacks.has(Number(id))) {
        await unlikeCardBack(Number(id));
      } else {
        await likeCardBack(Number(id));
      }
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  const handleCollect = async () => {
    try {
      if (collectedCardBacks.has(Number(id))) {
        await uncollectCardBack(Number(id));
      } else {
        await collectCardBack(Number(id));
      }
    } catch (error) {
      console.error("Failed to update collect status", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{cardBack.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{cardBack.text}</p>
        {cardBack.imageUrl && (
          <img src={cardBack.imageUrl} alt={cardBack.name} className="card-back-image" />
        )}
        <div className="action-buttons">
          <Button className="like-button" onClick={handleLike}>
            <FontAwesomeIcon icon={faHeart} className={likedCardBacks.has(Number(id)) ? "liked" : ""} />{" "}
            {likedCardBacks.has(Number(id)) ? "Liked" : "Like"}
          </Button>
          <Button className="collect-button" onClick={handleCollect}>
            <FontAwesomeIcon icon={faCheck} className={collectedCardBacks.has(Number(id)) ? "collected" : ""} />{" "}
            {collectedCardBacks.has(Number(id)) ? "Collected" : "Add to Collection"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CardBackDetail;





