"use strict";

/** Routes for cardbacks. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const CardBack = require("../models/cardBack");

const cardBackSearchSchema = require("../schemas/cardBackSearch.json");

const router = new express.Router();


/** GET /  =>
 *   { card backs: [ { id, name, text, imageUrl, sortCategory, slug }, ...] }
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, cardBackSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const cardBacks = await CardBack.findAll(q);
    return res.json({ cardBacks });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { cardback }
 *
 *  Cardback is { id, name, text, imageUrl, sortCategory, slug }
 *   
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const cardBack = await CardBack.get(req.params.id);
    return res.json({ cardBack });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;