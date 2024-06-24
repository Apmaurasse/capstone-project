import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import "./CardBackCard.css"; // Assuming you have a CSS file for custom styles

/** Show limited information about a card back.
 *
 * Is rendered by CardBackList to show a "card" for each card back.
 *
 * CardBackList -> CardBackCard
 */

function CardBackCard({ name, imageUrl, id, imageSize }) {
  console.debug("CardBackCard", imageUrl);

  const imageSizeClass = imageSize === "small" ? "card-img-small" : "card-img";
  
  return (
      <Link to={`/cardbacks/${id}`}>
        <Card className="card-back-card">
          <Card.Img variant="top" src={imageUrl} alt={name} className={imageSizeClass} />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
          </Card.Body>
        </Card>
      </Link>
  );
}

export default CardBackCard;



