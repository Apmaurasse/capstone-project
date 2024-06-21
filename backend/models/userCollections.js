"use strict";

const db = require("../db");

class UserCollections {
  /** Add a card back to a user's collection.
   *
   * Returns { user_id, card_back_id }
   **/
  static async create({ userId, cardBackId }) {
    const result = await db.query(
      `INSERT INTO UserCollections (user_id, card_back_id)
       VALUES ($1, $2)
       RETURNING user_id, card_back_id`,
      [userId, cardBackId]
    );
    const collection = result.rows[0];
    return collection;
  }

  /** Delete collected card from database; returns undefined.
   *
   * Throws NotFoundError if collection not found.
   **/

  static async remove(userId, cardBackId) {
    const result = await db.query(
      `DELETE
       FROM UserCollections
       WHERE user_id = $1 AND card_back_id = $2
       RETURNING id`,
      [userId, cardBackId]
    );
    const collection = result.rows[0];
    if (!collection) throw new NotFoundError(`Not collected for user id: ${userId} and card back id: ${cardBackId}`);
  }

  /** Find a collection by user_id and card_back_id.
   *
   * Returns { user_id, card_back_id } or undefined if not found.
   **/
  static async findOne({ user_id, card_back_id }) {
    const result = await db.query(
      `SELECT user_id, card_back_id
       FROM UserCollections
       WHERE user_id = $1 AND card_back_id = $2`,
      [user_id, card_back_id]
    );
    return result.rows[0];
  }
}

module.exports = UserCollections;