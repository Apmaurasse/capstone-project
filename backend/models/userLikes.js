"use strict";

const db = require("../db");

class UserLikes {
  /** Add a like for a user.
   *
   * Returns { user_id, card_back_id }
   **/
  static async create({ userId, cardBackId }) {
    const result = await db.query(
      `INSERT INTO UserLikes (user_id, card_back_id)
       VALUES ($1, $2)
       RETURNING user_id, card_back_id`,
      [userId, cardBackId]
    );
    const like = result.rows[0];
    return like;
  }

  /** Delete given like from database; returns undefined.
   *
   * Throws NotFoundError if like not found.
   **/

  static async remove(userId, cardBackId) {
    const result = await db.query(
      `DELETE
       FROM UserLikes
       WHERE user_id = $1 AND card_back_id = $2
       RETURNING id`,
      [userId, cardBackId]
    );
    const like = result.rows[0];
    if (!like) throw new NotFoundError(`No like for user id: ${userId} and card back id: ${cardBackId}`);
  }

  /** Find a like by user_id and card_back_id.
   *
   * Returns { user_id, card_back_id } or undefined if not found.
   **/
  static async findOne({ user_id, card_back_id }) {
    const result = await db.query(
      `SELECT user_id, card_back_id
       FROM UserLikes
       WHERE user_id = $1 AND card_back_id = $2`,
      [user_id, card_back_id]
    );
    return result.rows[0];
  }
}

module.exports = UserLikes;
