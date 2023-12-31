const express = require("express");
const router = express.Router();
const {searchForSongOptions} = require("../controllers/spotify");
const {createPlaylist, getPlaylist, deletePlaylist, addToPlaylist, deleteSongFromPlaylist, getAllPlaylists, getUserPlaylists} = require("../controllers/mongo.js");
const {authenticateToken} = require("../controllers/authentication.js");
const {registration} = require("../controllers/registration.js");
const {login} = require("../controllers/login.js");

router.post("/register", registration);

router.post("/login", login);

router.post("/createPlaylist", authenticateToken, createPlaylist);

router.put("/addToPlaylist", authenticateToken, addToPlaylist);

router.get("/searchForSongOptions", searchForSongOptions);

router.put("/deleteSongFromPlaylist", authenticateToken, deleteSongFromPlaylist);

router.get("/getPlaylist", authenticateToken, getPlaylist);

router.get("/getUserPlaylists", authenticateToken, getUserPlaylists);

router.get("/getAllPlaylists", authenticateToken, getAllPlaylists);

router.delete("/deletePlaylist", authenticateToken, deletePlaylist);

module.exports = {router};