const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, closeServer } = require("../server");
const request = require("supertest");
const User = require("../models/user");
const Playlist = require("../models/playlist");
const Song = require("../models/song");
require("dotenv").config();

let token;
let userId;
let playlist;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const response = await request(app).post("/login").send({
    username: "Test",
    password: "1234567890",
  });
  token = response.body.token;
  userId = jwt.verify(token, process.env.JWT_SECRET).id;
});

afterAll(async () => {
  await mongoose.connection.close();
  closeServer();
});

beforeEach(async () => {
  playlist = await Playlist.create({
    name: "Test Playlist",
    description: "My awesome playlist",
    owner: userId,
  });
  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { playlists: playlist._id } }
  );
});

afterEach(async () => {
  await Playlist.deleteOne({ _id: playlist._id });
});

describe("Playlist Management", () => {
  describe("Create Playlist", () => {
    it("should create a new playlist", async () => {
      await Playlist.deleteOne({ _id: playlist._id });
      const response = await request(app)
        .post("/createPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          name: "Test Playlist",
          description: "My awesome playlist",
        })
        .expect(200);

      playlistId = response.body._id;

      expect(response.body.name).toBe("Test Playlist");
      expect(response.body.description).toBe("My awesome playlist");
      expect(response.body.owner).toBe(userId);
    });

    it("should return an error if the playlist already exists", async () => {
      playlistId = playlist._id;

      await request(app)
        .post("/createPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          name: "Test Playlist",
          description: "Another playlist",
        })
        .expect(409);
    });
  });

  describe("Delete Playlist", () => {
    it("should delete an existing playlist", async () => {
      await request(app)
        .delete("/deletePlaylist")
        .set("Authorization", "Bearer " + token)
        .query({ playlist: "Test Playlist" })
        .expect(200);

      const deletedPlaylist = await Playlist.findById(playlist._id);
      expect(deletedPlaylist).toEqual(
        expect.objectContaining({
          name: "Test Playlist",
          description: "My awesome playlist",
        })
      );
    });

    it("should return an error if the playlist is not found for the user", async () => {
      await request(app)
        .delete("/deletePlaylist")
        .set("Authorization", "Bearer " + token)
        .query({ playlist: "Test Non Existant Playlist" })
        .expect(404);
    });
  });

  describe("Add to Playlist", () => {
    it("should add a song to an existing playlist", async () => {
      const response = await request(app)
        .put("/addToPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          playlist: "Test Playlist",
          title: "Song Name",
          artist: "Artist Name",
          duration: 180,
        })
        .expect(200);

      expect(response.body.title).toBe("Song Name");
      expect(response.body.artist).toBe("Artist Name");
      expect(response.body.duration).toBe(180);
    });

    it("should return an error if the playlist is not found", async () => {
      await request(app)
        .put("/addToPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          playlist: "Test Non Existant Playlist",
          title: "Song Name",
          artist: "Artist Name",
          duration: 180,
        })
        .expect(404);
    });
  });

  describe("Delete Song from Playlist", () => {
    it("should delete a song from an existing playlist", async () => {
      const song = Song.create({
        title: "Song Name",
        artist: "Artist Name",
        duration: 180,
      });
      const playlist = await Playlist.findOneAndUpdate(
        { name: "Test Playlist" },
        { $push: { songs: song._id } }
      );

      const response = await request(app)
        .put("/deleteSongFromPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          playlist: "Test Playlist",
          song: "Song Name",
        })
        .expect(200);

      expect(response.body.songs.length).toBe(0);
    });

    it("should return an error if the playlist is not found", async () => {
      await request(app)
        .put("/deleteSongFromPlaylist")
        .set("Authorization", "Bearer " + token)
        .send({
          playlist: "Test Playlist",
          song: "Song Name",
        })
        .expect(404);
    });
  });

  describe("Get Playlist", () => {
    it("should get an existing playlist", async () => {
      const playlist = await Playlist.create({
        name: "Test Playlist",
        description: "My awesome playlist",
        owner: userId,
        songs: [
          {
            title: "Song 1",
            artist: "Artist 1",
            duration: 180,
          },
          {
            title: "Song 2",
            artist: "Artist 2",
            duration: 240,
          },
        ],
      });

      const response = await request(app)
        .get("/getPlaylist")
        .set("Authorization", "Bearer " + token)
        .query({ playlist: playlist.name })
        .expect(200);

      expect(response.body.name).toBe("Test Playlist");
      expect(response.body.description).toBe("My awesome playlist");
      expect(response.body.owner).toBe(userId);
      expect(response.body.songs.length).toBe(2);
    });

    it("should return an error if the playlist is not found", async () => {
      await request(app)
        .get("/getPlaylist")
        .set("Authorization", "Bearer " + token)
        .query({ playlist: "Test Non Existant Playlist" })
        .expect(404);
    });
  });

  describe("Get User Playlists", () => {
    it("should get all playlists for a user", async () => {
      await Playlist.create({
        name: "Playlist 1",
        description: "Playlist 1 description",
        owner: userId,
      });
      await Playlist.create({
        name: "Playlist 2",
        description: "Playlist 2 description",
        owner: userId,
      });

      const response = await request(app)
        .get("/getUserPlaylists")
        .set("Authorization", "Bearer " + token)
        .expect(200);

      expect(response.body.length).toBe(2);
    });
  });

  describe("Get All Playlists", () => {
    it("should get all playlists", async () => {
      await Playlist.create({
        name: "Playlist 1",
        description: "Playlist 1 description",
        owner: "user1",
      });
      await Playlist.create({
        name: "Playlist 2",
        description: "Playlist 2 description",
        owner: "user2",
      });

      const response = await request(app)
        .get("/getAllPlaylists")
        .set("Authorization", "Bearer " + token)
        .expect(200);

      expect(response.body.length).toBe(2);
    });
  });
});
