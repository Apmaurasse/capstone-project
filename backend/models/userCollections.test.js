"use strict";

const db = require("../db");
const UserCollections = require("./userCollections");
const { NotFoundError } = require("../expressError");

beforeAll(async () => {
  await db.query(`
    DELETE FROM UserCollections;
    DELETE FROM Users;
    DELETE FROM CardBacks;
  `);

  await db.query(`
    INSERT INTO Users (id, username, email, password_hash, first_name, last_name, is_admin)
    VALUES (1, 'testuser', 'testuser@example.com', 'password', 'Test', 'User', false)
  `);

  await db.query(`
    INSERT INTO CardBacks (id, name, text, image_url, sort_category, slug)
    VALUES (1, 'Classic Card Back', 'The default card back', 'http://example.com/classic.png', 1,'classic')
  
  `);
});

beforeEach(async () => {
  await db.query("BEGIN");
});

afterEach(async () => {
  await db.query("ROLLBACK");
});

afterAll(async () => {
  await db.query(`
    DELETE FROM UserCollections;
    DELETE FROM Users;
    DELETE FROM CardBacks;
  `);
  await db.end();
});

describe("UserCollections.create", () => {
  test("works", async () => {
    const collection = await UserCollections.create({ userId: 1, cardBackId: 1 });
    expect(collection).toEqual({
      user_id: 1,
      card_back_id: 1,
    });
  });
});

describe("UserCollections.remove", () => {
  test("works", async () => {
    await UserCollections.create({ userId: 1, cardBackId: 1 });
    await UserCollections.remove(1, 1);
    const res = await db.query(
      `SELECT user_id, card_back_id FROM UserCollections WHERE user_id = 1 AND card_back_id = 1`
    );
    expect(res.rows.length).toEqual(0);
  });

});

describe("UserCollections.findOne", () => {
  test("works", async () => {
    await UserCollections.create({ userId: 1, cardBackId: 1 });
    const collection = await UserCollections.findOne({ user_id: 1, card_back_id: 1 });
    expect(collection).toEqual({
      user_id: 1,
      card_back_id: 1,
    });
  });

  test("not found if no such collection", async () => {
    const collection = await UserCollections.findOne({ user_id: 1, card_back_id: 999 });
    expect(collection).toBeUndefined();
  });
});

