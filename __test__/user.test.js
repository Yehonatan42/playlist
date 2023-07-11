const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {app, closeServer} = require("../server");
const User = require("../models/user");
const request = require("supertest");
const { generateAuthToken } = require("../controllers/authentication");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.findOneAndDelete({ username: "Test" });
});

afterEach(async () => {
  await mongoose.connection.close();
});

afterAll(async () => {
  await closeServer();
});

describe("User Registration and Login", () => {
  describe("User Registration", () => {
    test("Should signup a new user", async () => {
      const response = await request(app)
        .post("/register")
        .send({
          username: "Test",
          password: "1234567890",
        })
        .expect(200);

      const receivedToken = response.body.token;
      const decodedToken = jwt.verify(receivedToken, secretKey);
      const userId = decodedToken.id;
      const user = await User.findById(userId);

      expect(receivedToken).toBe(generateAuthToken(user));
      expect(user.username).toBe("Test");
      expect(user.password).not.toBe("1234567890");
    });

    test("Should return error for an existing username", async () => {
      await User.create({
        username: "Test",
        password: "password123",
      });

      const response = await request(app)
        .post("/register")
        .send({
          username: "Test",
          password: "newpassword",
        })
        .expect(409);

      expect(response.body.message).toBe("Username is already taken");
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      await User.create({
        username: "Test",
        password: "1234567890",
      });
    });

    test("Should login a test user", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "Test",
          password: "1234567890",
        })
        .expect(200);

      const receivedToken = response.body.token;
      const decodedToken = jwt.verify(receivedToken, secretKey);
      const userId = decodedToken.id;
      const user = await User.findById(userId);

      expect(receivedToken).toBe(generateAuthToken(user));
      expect(user.username).toBe("Test");
      expect(user.password).not.toBe("1234567890");
    });

    test("Should return error for a non-existent user", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "NonExistentUser",
          password: "password123",
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    test("Should return error when invalid credentials entered", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: null,
          password: null,
        })
        .expect(400);

      expect(response.body.message).toBe(
        "Please provide a username and password"
      );
    });

    test("Should return error when wrong password entered", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "Test",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
