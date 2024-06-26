"use strict";

const db = require("../db");
const CardBack = require("./cardBack");
const { NotFoundError } = require("../expressError");

beforeAll(async () => {
  await db.query(`
    DELETE FROM UserLikes;
    DELETE FROM UserCollections;
    DELETE FROM Users;
    DELETE FROM CardBacks;
  `);
});

beforeEach(async () => {
  await db.query("BEGIN");

  await db.query(`
    INSERT INTO CardBacks (id, name, text, image_url, sort_category, slug)
    VALUES (1, 'Classic Card Back', 'The default card back', 'http://example.com/classic.png', 1, 'classic'),
           (2, 'Legend Card Back', 'Given to players who reach Legend rank', 'http://example.com/legend.png', 2, 'legend')
  `);
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

afterAll(async () => {
  await db.query(`
    DELETE FROM UserLikes;
    DELETE FROM UserCollections;
    DELETE FROM Users;
    DELETE FROM CardBacks;
  `);
  await db.end();
});

describe("CardBack.findAll", () => {
  test("works: no filter", async () => {
    const cardBacks = await CardBack.findAll();
    expect(cardBacks).toEqual([
      {
        id: 1,
        name: "Classic Card Back",
        text: "The default card back",
        imageUrl: "http://example.com/classic.png",
        sortCategory: 1,
        slug: "classic",
      },
      {
        id: 2,
        name: "Legend Card Back",
        text: "Given to players who reach Legend rank",
        imageUrl: "http://example.com/legend.png",
        sortCategory: 2,
        slug: "legend",
      },
    ]);
  });

  test("works: with name filter", async () => {
    const cardBacks = await CardBack.findAll({ name: "Classic" });
    expect(cardBacks).toEqual([
      {
        id: 1,
        name: "Classic Card Back",
        text: "The default card back",
        imageUrl: "http://example.com/classic.png",
        sortCategory: 1,
        slug: "classic",
      },
    ]);
  });

  test("works: no results with name filter", async () => {
    const cardBacks = await CardBack.findAll({ name: "Nonexistent" });
    expect(cardBacks).toEqual([]);
  });
});

describe("CardBack.get", () => {
  test("works", async () => {
    const cardBack = await CardBack.get(1);
    expect(cardBack).toEqual({
      id: 1,
      name: "Classic Card Back",
      text: "The default card back",
      imageUrl: "http://example.com/classic.png",
      sortCategory: 1,
      slug: "classic",
    });
  });

  test("not found if no such card back", async () => {
    try {
      await CardBack.get(999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

