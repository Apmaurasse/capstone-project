"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createToken } = require("../helpers/tokens");

// Define a test token for admin user
const testAdminToken = createToken({ username: "admin", isAdmin: true });

beforeEach(async function () {
  // Clean out data from tables before each test
  await db.query("DELETE FROM UserLikes");
  await db.query("DELETE FROM UserCollections");
  await db.query("DELETE FROM Users");
});

afterAll(async function () {
  // Close db connection after all tests
  await db.end();
});

describe("POST /users", function () {
  test("creates a new user", async function () {
    const response = await request(app)
      .post("/users")
      .send({
        username: "testuser",
        password: "password",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        isAdmin: false,
      })
      .set("Authorization", `Bearer ${testAdminToken}`)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining({
      user: expect.objectContaining({
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        isAdmin: false,
      }),
      token: expect.any(String),
    }));
  });
});

describe("GET /users", function () {
  test("gets a list of all users", async function () {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${testAdminToken}`)
      .expect(200);

    expect(response.body.users).toHaveLength(0); // Assuming no users initially
  });
});

