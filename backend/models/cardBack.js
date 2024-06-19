"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for card backs. */

class CardBack {


    /** Find all card backs. */
  static async findAll(searchFilters = {}) {
    let query = `SELECT id,
                        name,
                        text,
                        image_url AS "imageUrl",
                        sort_category AS "sortCategory",
                        slug
                 FROM cardbacks`;
    let whereExpressions = [];
    let queryValues = [];

    const  {name}  = searchFilters;

    if (name) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY id";
    const cardbacksRes = await db.query(query, queryValues);
    // console.log(cardbacksRes.rows); 
    return cardbacksRes.rows;
    
  }
  
  /** Find one card back. */
  static async get(id) {
    const cardBackRes = await db.query(
          `SELECT id,
                  name,
                  text,
                  image_url AS "imageUrl",
                  sort_category AS "sortCategory",
                  slug
           FROM CardBacks
           WHERE id = $1`,
        [id]);

    const cardBack = cardBackRes.rows[0];

    if (!cardBack) throw new NotFoundError(`No card back with id: ${id}`);

    return cardBack;
  }


}


module.exports = CardBack;