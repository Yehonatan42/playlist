const { connectToDB, disconnectDB } = require('../controllers/connectToDB.js');
const jwt = require("jsonwebtoken");
const { app, closeServer } = require("../server");
const request = require("supertest");
const User = require("../models/user");
const {generateAuthToken} = require("../controllers/authentication");
require("dotenv").config();

beforeAll(async () => {
  await connectToDB();
});

afterAll(async () => {
  await User.deleteMany();
  await disconnectDB();
  closeServer();
});

describe("User Registration and Login", () => {
  describe("User Registration", () => {
    test("Should signup a new user", async () => {
      await User.findOneAndDelete({ username: "Test" });
      const response = await request(app)
        .post("/register")
        .send({
          username: "Test",
          password: "1234567890",
        })
        .expect(200);
      
      const receivedToken = response.body.token;
      const decodedToken = jwt.verify(receivedToken, process.env.JWT_SECRET);
      const userId = decodedToken.id;
      const user = await User.findById(userId);

      expect(receivedToken).toBe(generateAuthToken(user));
      expect(user.username).toBe("Test");
      expect(user.password).not.toBe("1234567890");
    });

    test("Should return error for an existing username", async () => {
      const response = await request(app)
        .post("/register")
        .send({
          username: "Test",
          password: "1234567890",
        })
        .expect(409);
    });
  });

  describe("User Login", () => {
    test("Should login a test user", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "Test",
          password: "1234567890",
        })
        .expect(200);
       
      const receivedToken = response.body.token;
      const decodedToken = jwt.verify(receivedToken, process.env.JWT_SECRET);
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
    });

    test("Should return error when invalid credentials entered", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: null,
          password: null,
        })
        .expect(400);
    });

    test("Should return error when wrong password entered", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "Test",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
});
