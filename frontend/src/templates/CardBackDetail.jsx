import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectOmegaApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

/** Company Detail page.
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

  useEffect(function getCardBackForUser() {
    async function getCardBack() {
      setCardBack(await ProjectOmegaApi.getCardBack(id));
    }

    getCardBack();
  }, [id]);

  if (!cardBack) return <LoadingSpinner />;

  return (
      <div>
        <h4>{cardBack.name}</h4>
        <p>{cardBack.text}</p>
        {cardBack.imageUrl && <img src={cardBack.imageUrl}
                             alt={cardBack.name}
                             />}
      </div>
  );
}

export default CardBackDetail;