import React, { useState, useEffect } from "react";
import ProjectOmegaApi from "../api/api";
import CardBackCard from "./CardBackCard";
import LoadingSpinner from "../common/LoadingSpinner";


// Todo: add search form
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
    // console.log(cardBacks);
  }

  if (!cardBacks) return <LoadingSpinner />;

  return (
      <div>
        {cardBacks.length
            ? (
                <div>
                  {cardBacks.map(c => (
                      <CardBackCard
                        key={c.id}
                        id={c.id}
                        name={c.name}
                        description={c.text}
                        imageUrl={c.imageUrl}
                        sortCategory={c.sortCategory}
                        slug={c.slug}                          
                      />
                  ))}
                </div>
            ) : (
                <p>Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default CardBackList;