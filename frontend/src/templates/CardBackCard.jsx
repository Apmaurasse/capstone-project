import React from "react";
import { Link } from "react-router-dom";


/** Show limited information about a card back.
 *
 * Is rendered by CardBackList to show a "card" for each card back.
 *
 * CardBackList -> CardBackCard
 */

function CardBackCard({ name, imageUrl, id }) {
  console.debug("CardBackCard", imageUrl);

  return (
      <Link to={`/cardbacks/${id}`}>
        <div>
          <h6>
            {name}
            {imageUrl && <img src={imageUrl}
                             alt={name}
                             />}
          </h6>
        </div>
      </Link>
  );
}

export default CardBackCard;