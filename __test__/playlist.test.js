const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, closeServer } = require("../server");
const User = require("../models/user");
const request = require("supertest");
const Playlist = require("../models/playlist");
require("dotenv").config();

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const response = await request(app).post("/login").send({
    username: "Test",
    password: "1234567890",
  });
  token = response.body.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  userId = decodedToken.id;
});

afterAll(async () => {
  await mongoose.connection.close();
  closeServer();
});

describe("Playlist creation and deletion", () => {
  test("should create new playlist", async () => {
    await Playlist.findOneAndDelete({name: "Test Playlist", owner: userId});
    const response = await request(app)
      .post("/createPlaylist")
      .send({ name: "Test Playlist", description: "Test Description" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Test Playlist",
        description: "Test Description",
      })
    );
  });

  test("should delete a playlist", async () => {
    const response = await request(app)
      .delete("/deletePlaylist")
      .query({ playlist: "Test Playlist" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Test Playlist",
        description: "Test Description",
      })
    );
  });
});
