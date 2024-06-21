"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, email, firstName, lastName, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, email, firstName, lastName }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, email, firstName, lastName, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, email, firstName, lastName, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/likes => { likes: [cardBackId, ...] }
 *
 * Returns list of card back IDs liked by the user.
 *
 * Authorization required: same user-as-:username or admin
 **/

router.get("/:username/likes", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const likes = await User.getUserLikes(req.params.username);
    // console.log(likes);
    return res.json({ likes });
  } catch (err) {
    return next(err);
  }
});


/** POST /[username]/likes/:cardBackId => { liked: cardBackId }
 *
 * Adds a like to a card back for the user.
 *
 * Authorization required: logged in
 **/

router.post("/:username/likes/:cardBackId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const like = await User.addLike(req.params.username, req.params.cardBackId);
    return res.status(201).json({ like });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]/likes/:cardBackId => { unliked: cardBackId }
 *
 * Removes a like from a card back for the user.
 *
 * Authorization required: logged in
 **/

router.delete("/:username/likes/:cardBackId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.removeLike(req.params.username, req.params.cardBackId);
    return res.json({ unliked: req.params.cardBackId });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username]/collections => { collections: [cardBackId, ...] }
 *
 * Returns list of card back IDs collected by the user.
 *
 * Authorization required: same user-as-:username or admin
 **/

router.get("/:username/collections", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const collections = await User.getUserCollections(req.params.username);
    return res.json({ collections });
  } catch (err) {
    return next(err);
  }
});


/** POST /[username]/collections/:cardBackId => { Collected: cardBackId }
 *
 * Adds a card back to the user's collection.
 *
 * Authorization required: logged in
 **/

router.post("/:username/collections/:cardBackId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const collection = await User.addToCollection(req.params.username, req.params.cardBackId);
    return res.status(201).json({ collection });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]/collections/:cardBackId => { Uncollected: cardBackId }
 *
 * Removes a card back from the user's collection.
 *
 * Authorization required: logged in
 **/

router.delete("/:username/collections/:cardBackId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.removeFromCollection(req.params.username, req.params.cardBackId);
    return res.json({ uncollected: req.params.cardBackId});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;