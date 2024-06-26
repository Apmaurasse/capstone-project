"use strict";

const db = require("../db");
const User = require("./user");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

beforeAll(async () => {
    await db.query(`
    DELETE FROM UserLikes;
    DELETE FROM UserCollections;
    DELETE FROM Users;
  `);
});

beforeEach(async () => {
  // Begin a transaction
  await db.query("BEGIN");
  
  const hashedPassword = await bcrypt.hash("password", BCRYPT_WORK_FACTOR);

  // Create test data in your database
  await db.query(`
    INSERT INTO Users (username, email, password_hash, first_name, last_name, created_at, updated_at, is_admin)
    VALUES ('testuser', 'testuser@example.com', $1, 'Test', 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
  `, [hashedPassword]);
});

afterEach(async () => {
  // Rollback the transaction
  await db.query("ROLLBACK");
});

afterAll(async () => {
  // Delete all data to ensure clean state for next test run
  await db.query(`
    DELETE FROM UserLikes;
    DELETE FROM UserCollections;
    DELETE FROM Users;
  `);

  // Close the database connection
  await db.end();
});

describe("User.authenticate", () => {
    test("works", async () => {
        const user = await User.authenticate("testuser", "password");
        expect(user).toEqual({
          username: "testuser",
          email: "testuser@example.com",
          firstName: "Test",
          lastName: "User",
          isAdmin: false,
        });
      });

  test("unauth if no such user", async () => {
    try {
      await User.authenticate("no-such-user", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async () => {
    try {
      await User.authenticate("testuser", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe("User.register", () => {
  test("works", async () => {
    const user = await User.register({
      username: "newuser",
      email: "newuser@example.com",
      password: "password",
      firstName: "New",
      lastName: "User",
      isAdmin: false,
    });
    expect(user).toEqual({
      username: "newuser",
      email: "newuser@example.com",
      firstName: "New",
      lastName: "User",
      isAdmin: false,
    });
  });

  test("bad request with dup data", async () => {
    try {
      await User.register({
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
        firstName: "Test",
        lastName: "User",
        isAdmin: false,
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("User.findAll", () => {
  test("works", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        isAdmin: false,
      },
    ]);
  });
});

describe("User.get", () => {
    test("works", async () => {
        const user = await User.get("testuser");
        expect(user).toEqual({
          username: "testuser",
          email: "testuser@example.com",
          firstName: "Test",
          lastName: "User",
          isAdmin: false,
        });
      });


  test("not found if no such user", async () => {
    try {
      await User.get("no-such-user");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("User.update", () => {
  const updateData = {
    firstName: "NewFirst",
    lastName: "NewLast",
    email: "new@example.com",
    isAdmin: true,
  };

  test("works", async () => {
    const user = await User.update("testuser", updateData);
    expect(user).toEqual({
      username: "testuser",
      ...updateData,
    });
  });

  test("not found if no such user", async () => {
    try {
      await User.update("no-such-user", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

});

describe("User.remove", () => {
    test("works", async () => {
        await User.remove("testuser");
        const res = await db.query(
            "SELECT * FROM Users WHERE username='testuser'");
        expect(res.rows.length).toEqual(0);
      });

  test("not found if no such user", async () => {
    try {
      await User.remove("no-such-user");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
