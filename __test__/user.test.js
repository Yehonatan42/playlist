const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../server");
const User = require("../models/user");
const request = require("supertest");
const { generateAuthToken } = require("../controllers/authentication");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany();
});

afterEach(async () => {
  await mongoose.connection.close();
});

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/register")
    .send({
      username: "Test",
      password: "1234567890",
    })
    .expect(200);
  receivedToken = response.body.token;
  const decodedToken = jwt.verify(receivedToken, secretKey);
  const userId = decodedToken.id;
  const user = await User.findById(userId);
  expect(receivedToken).toBe(generateAuthToken(user));
  expect(user.username).toBe("Test");
  expect(user.password).not.toBe("1234567890");
});
