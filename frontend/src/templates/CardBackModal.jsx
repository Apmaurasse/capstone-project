import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import "./CardBackModal.css"; // Assuming you will have a CSS file for modal styles

function CardBackModal({ show, handleCloseModal, selectedCard }) {
  const { likedCardBacks, collectedCardBacks, likeCardBack, unlikeCardBack, collectCardBack, uncollectCardBack } = useContext(ProjectOmegaContext);

  const handleLike = async (id) => {
    if (likedCardBacks.has(id)) {
      await unlikeCardBack(id);
    } else {
      await likeCardBack(id);
    }
  };

  const handleCollect = async (id) => {
    if (collectedCardBacks.has(id)) {
      await uncollectCardBack(id);
    } else {
      await collectCardBack(id);
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal} className="custom-modal" contentClassName="custom-modal-content" size="lg">
      <Modal.Body>
        <div className="modal-content-wrapper">
          <div className="modal-image">
            <img src={selectedCard.imageUrl} alt={selectedCard.name} />
          </div>
          <div className="modal-details">
            <div className="custom-modal-close-button" onClick={handleCloseModal}>
              X
            </div>
            <h1>{selectedCard.name}</h1>
            <p>{selectedCard.text}</p>
            <div className="card-actions">
              <button onClick={() => handleLike(selectedCard.id)} className="icon-button">
                <FontAwesomeIcon icon={faHeart} color={likedCardBacks.has(selectedCard.id) ? 'red' : 'grey'} />
              </button>
              <button onClick={() => handleCollect(selectedCard.id)} className="icon-button">
                <FontAwesomeIcon icon={faCheckCircle} color={collectedCardBacks.has(selectedCard.id) ? 'green' : 'grey'} />
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CardBackModal;
