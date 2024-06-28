"use strict";

const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported from app.js
const db = require("../db");

beforeEach(async function () {
  // Clean out data from any relevant tables before each test
  await db.query("DELETE FROM CardBacks");
});

afterAll(async function () {
  // Close db connection after all tests
  await db.end();
});

describe("GET /cardbacks", function () {
  test("returns a list of card backs", async function () {
    // Insert test data into the CardBacks table
    await db.query(`
      INSERT INTO CardBacks (id, name, text, image_url, sort_category, slug)
      VALUES (1, 'Classic Card Back', 'The default card back', 'http://example.com/classic.png', 1, 'classic'),
             (2, 'Epic Card Back', 'An epic card back', 'http://example.com/epic.png', 2, 'epic')
    `);

    const response = await request(app).get("/cardbacks").expect(200);

    expect(response.body.cardBacks).toHaveLength(2);
    expect(response.body.cardBacks[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: "Classic Card Back",
      text: "The default card back",
      imageUrl: "http://example.com/classic.png",
      sortCategory: 1,
      slug: "classic"
    }));
  });
});

describe("GET /cardbacks/:id", function () {
  test("returns a specific card back by id", async function () {
    // Insert test data into the CardBacks table
    await db.query(`
      INSERT INTO CardBacks (id, name, text, image_url, sort_category, slug)
      VALUES (1, 'Classic Card Back', 'The default card back', 'http://example.com/classic.png', 1, 'classic')
    `);

    const response = await request(app).get("/cardbacks/1").expect(200);

    expect(response.body.cardBack).toEqual({
      id: 1,
      name: "Classic Card Back",
      text: "The default card back",
      imageUrl: "http://example.com/classic.png",
      sortCategory: 1,
      slug: "classic"
    });
  });

  test("returns 404 if card back not found", async function () {
    const response = await request(app).get("/cardbacks/999").expect(404);
    expect(response.body.error.message).toBe("No card back with id: 999");
  });
});

// Add more tests as needed for other routes and edge cases




