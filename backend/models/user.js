"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const UserLikes = require("./userLikes");
const UserCollections = require("./userCollections");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, email, first_name, last_name, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  email,
                  password_hash,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  is_admin AS "isAdmin"
           FROM Users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (isValid === true) {
        delete user.password_hash;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, email, firstName, lastName, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, email, password, firstName, lastName, isAdmin }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM Users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO Users
           (username,
            email,
            password_hash,
            first_name,
            last_name,
            created_at,
            updated_at,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $6)
           RETURNING username, email, first_name AS "firstName", last_name AS "lastName", is_admin AS "isAdmin"`,
        [
          username,
          email,
          hashedPassword,
          firstName,
          lastName,
          isAdmin,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, email, first_name, last_name, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  email,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  is_admin AS "isAdmin"
           FROM Users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, UserLikes, UserCollections }
   *   where UserLikes is { id, user_id, card_back_id }
   *   where UserCollections is { id, user_id, card_back_id }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  email,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  is_admin AS "isAdmin"
           FROM Users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { email, firstName, lastName, password, isAdmin }
   *
   * Returns { username, email, firstName, lastName, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async update(username, data) {
    if (data.password_hash) {
      data.password_hash = await bcrypt.hash(data.password_hash, BCRYPT_WORK_FACTOR);
    }

    data.updated_at = new Date();

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
          isAdmin: "is_admin",
          updated_at: "updated_at"
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE Users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                email,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                is_admin AS "isAdmin",
                                updated_at`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password_hash;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM Users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }



   /** Add a like to the user's liked card backs.
   *
   * data should be { username, cardBackId }
   *
   * Returns { id, userId, cardBackId }
   **/

  static async addLike(username, cardBackId) {
    // Retrieve user_id based on username
    const userRes = await db.query(
      `SELECT id
       FROM Users
       WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userId = user.id;

    return await UserLikes.create({ userId, cardBackId });
  }

  /** Remove a like from the user's liked card backs.
   *
   * data should be { username, cardBackId }
   *
   * Returns undefined.
   **/

  static async removeLike(username, cardBackId) {
    // Retrieve user_id based on username
    const userRes = await db.query(
      `SELECT id
       FROM Users
       WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userId = user.id;
    console.debug("removeLike userId:", userId);

    cardBackId = parseInt(cardBackId, 10); // Ensure cardBackId is an integer
    return await UserLikes.remove(userId, cardBackId);
  }

  /** Check if a user has liked a card back.
   *
   * Returns { user_id, card_back_id } or undefined if not found.
   **/
  static async hasLiked(userId, cardBackId) {
    return await UserLikes.findOne({ user_id: userId, card_back_id: cardBackId });
  }
  
  /** Get user likes for a given username.
   *
   * Returns [{ card_back_id, ...}]
   **/

  static async getUserLikes(username) {
    const result = await db.query(
      `SELECT ul.card_back_id
       FROM UserLikes AS ul
       JOIN Users AS u ON ul.user_id = u.id
       WHERE u.username = $1`,
      [username]
    );

    // Return an empty array if no likes are found
    return result.rows.map(row => row.card_back_id);
  }


   /** Add a card back to the user's collected card backs.
   *
   * data should be { username, cardBackId }
   *
   * Returns { id, userId, cardBackId }
   **/

   static async addToCollection(username, cardBackId) {
    // Retrieve user_id based on username
    const userRes = await db.query(
      `SELECT id
       FROM Users
       WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userId = user.id;

    return await UserCollections.create({ userId, cardBackId });
  }

  /** Remove a card back from the user's collected card backs.
   *
   * data should be { username, cardBackId }
   *
   * Returns undefined.
   **/

  static async removeFromCollection(username, cardBackId) {
    // Retrieve user_id based on username
    const userRes = await db.query(
      `SELECT id
       FROM Users
       WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userId = user.id;
    console.debug("removeFromCollection userId:", userId);

    cardBackId = parseInt(cardBackId, 10); // Ensure cardBackId is an integer
    return await UserCollections.remove(userId, cardBackId);
  }

  /** Check if a user has collected a card back.
   *
   * Returns { user_id, card_back_id } or undefined if not found.
   **/
  static async hasCollected(userId, cardBackId) {
    return await UserCollections.findOne({ user_id: userId, card_back_id: cardBackId });
  }
  
  /** Get user collections for a given username.
   *
   * Returns [{ card_back_id, ...}]
   **/

  static async getUserCollections(username) {
    const result = await db.query(
      `SELECT uC.card_back_id
       FROM UserCollections AS uC
       JOIN Users AS u ON uC.user_id = u.id
       WHERE u.username = $1`,
      [username]
    );

    // Return an empty array if no collected card backs are found
    return result.rows.map(row => row.card_back_id);
  }

}


module.exports = User;