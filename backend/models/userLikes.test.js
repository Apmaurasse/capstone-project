"use strict";

const db = require("../db");
const UserLikes = require("./userLikes");
const { NotFoundError } = require("../expressError");

beforeAll(async () => {
  await db.query(`
    DELETE FROM UserLikes;
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
    DELETE FROM UserLikes;
    DELETE FROM Users;
    DELETE FROM CardBacks;
  `);
  await db.end();
});

describe("Userlikes.create", () => {
  test("works", async () => {
    const likes = await UserLikes.create({ userId: 1, cardBackId: 1 });
    expect(likes).toEqual({
      user_id: 1,
      card_back_id: 1,
    });
  });
});

describe("UserLikes.remove", () => {
  test("works", async () => {
    await UserLikes.create({ userId: 1, cardBackId: 1 });
    await UserLikes.remove(1, 1);
    const res = await db.query(
      `SELECT user_id, card_back_id FROM UserLikes WHERE user_id = 1 AND card_back_id = 1`
    );
    expect(res.rows.length).toEqual(0);
  });

});

describe("UserLikes.findOne", () => {
  test("works", async () => {
    await UserLikes.create({ userId: 1, cardBackId: 1 });
    const likes = await UserLikes.findOne({ user_id: 1, card_back_id: 1 });
    expect(likes).toEqual({
      user_id: 1,
      card_back_id: 1,
    });
  });

  test("not found if no such like", async () => {
    const likes = await UserLikes.findOne({ user_id: 1, card_back_id: 999 });
    expect(likes).toBeUndefined();
  });
});

