import React, { useState, useEffect } from "react";
import ProjectOmegaApi from "../api/api";
import CardBackCard from "./CardBackCard";
import LoadingSpinner from "../common/LoadingSpinner";
import "./CardBackList.css"; // Assuming you have a CSS file for custom styles

/** Show page with list of card backs.
 *
 * On mount, loads card backs from API.
 * Re-loads filtered card backs on submit from search form.
 *
 * This is routed to at /cardbacks
 *
 * Routes -> { CardBackCard }
 */

function CardBackList() {
  console.debug("CardBackList");

  const [cardBacks, setCardBacks] = useState(null);

  useEffect(function getCardBacksOnMount() {
    console.debug("CardBackList useEffect getCardBacksOnMount");
    search();
  }, []);

  /** Triggered by search form submit; reloads card backs. */
  async function search() {
    let cardBacks = await ProjectOmegaApi.getCardBacks();
    setCardBacks(cardBacks);
  }

  if (!cardBacks) return <LoadingSpinner />;

  return (
    <div className="card-back-list-container">
      <h4 className="liked-card-backs-header">Gallery</h4>
      <div className="card-back-list">
        {cardBacks.length ? (
          cardBacks.map((c) => (
            <div key={c.id} className="card-back-list-item">
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
    </div>
  );
}

export default CardBackList;

