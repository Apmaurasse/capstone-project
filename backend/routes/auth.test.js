"use strict";

const request = require("supertest");
const app = require("../app"); 
const db = require("../db");

beforeEach(async function () {
  // Clean out data from any relevant tables before each test
  await db.query("DELETE FROM users");
});

afterAll(async function () {
  // Close db connection after all tests
  await db.end();
});

describe("POST /auth/token", function () {
  test("returns 401 on invalid credentials", async function () {
    const response = await request(app)
      .post("/auth/token")
      .send({ username: "invaliduser", password: "invalidpassword" })
      .expect(401);

    expect(response.body.error.message).toBe("Invalid username/password");
  });

  test("returns 400 on missing credentials", async function () {
    const response = await request(app)
      .post("/auth/token")
      .send({ username: "testuser" })
      .expect(400);

    expect(response.body.error.message).toContain("instance requires property \"password\"");
  });
});



