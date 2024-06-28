import React from "react";
import { Card } from "react-bootstrap";
import "./CardBackCard.css"; // Assuming you have a CSS file for custom styles

function CardBackCard({ name, imageUrl, imageSize, onClick }) {
  const imageSizeClass = imageSize === "small" ? "card-img-small" : "card-img";

  return (
    <Card className="card-back-card" onClick={onClick}>
      <Card.Img variant="top" src={imageUrl} alt={name} className={imageSizeClass} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default CardBackCard;




