const Playlist = require("../models/playlist");
const Song = require("../models/song");
const User = require("../models/user");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const createPlaylist = async (req, res) => {
  try {
    const playlistName = req.body.name;
    const description = req.body.description;
    const userId = req.headers.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    const existingPlaylist = await Playlist.findOne({
      name: playlistName,
      owner: user._id
    });
    if (existingPlaylist) {
      return res.status(409).send("Playlist already exists");
    }
    
    const playlist = new Playlist({
      name: playlistName,
      description: description,
      owner: user._id,
    });

    user.playlists.push(playlist._id);
    await user.save();
    await playlist.save();

    console.log("Playlist created successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating playlist");
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.query.playlist;

    const user = await User.findById(userId).populate("playlists");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const searchedPlaylist = await user.playlists
      .find((playlist) => playlist.name === playlistName).populate("owner");
    if (!searchedPlaylist) {
      return res.status(404).send("Playlist not found");
    }

    await user.updateOne({ $pull: { playlists: searchedPlaylist._id } });

    if (searchedPlaylist.owner._id.equals(user._id)) {
      await Playlist.deleteOne({ _id: searchedPlaylist._id });
    }
    await user.save();

    console.log("Playlist deleted successfully");
    res.status(200).json(searchedPlaylist);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting playlist");
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.body.playlist;
    const songName = req.body.songName;
    const artistName = req.body.artistName;
    const duration = req.body.duration;

    const user = await User.findById(userId).populate("playlists");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).send("Playlist not found");
    }
    const playlist = await Playlist.findById(searchedPlaylist._id);

    const existingSong = await Song.findOne({ title: songName });
    let newSong;

    if (existingSong) {
      newSong = existingSong;
    } else {
      newSong = await Song.create({
        title: songName,
        artist: artistName,
        duration: duration,
      });
    }

    if (!playlist.songs.includes(newSong._id)) {
      playlist.duration += newSong.duration;
      playlist.songs.push(newSong._id);
      await playlist.save();
    }

    console.log("Song added successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding songs");
  }
};

const deleteSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.body.playlist;
    const songName = req.body.song;

    const user = await User.findById(userId).populate("playlists");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).send("Playlist not found");
    }

    const playlist = await Playlist.findById(searchedPlaylist._id).populate(
      "songs"
    );
    if (!playlist) {
      return res.status(404).send("Playlist not found");
    }

    const song = playlist.songs.find((song) => song.title === songName);
    playlist.songs.pull({ _id: song._id });
    playlist.duration -= song.duration;
    await playlist.save();

    console.log("Song deleted successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting song from playlist");
  }
};

const getPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.query.playlist;

    const user = await User.findById(userId).populate("playlists");
    if (!user) {
      return res.status(404).send("User not found");
    }

    const playlist = await user.playlists
      .find((playlist) => playlist.name === playlistName)
      .populate("songs");
    if (!playlist) {
      return res.status(404).send("Playlist not found");
    }

    console.log("playlist fetched successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting playlist");
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const user = await User.findById(userId).populate("playlists");
    if (!user) {
      return res.status(404).send("User not found");
    }
    const playlists = user.playlists;
    console.log("Fetched playlists successfully");
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};

const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({}).populate("owner");
    console.log("Fetched playlists successfully");

    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  addToPlaylist,
  deleteSongFromPlaylist,
  getAllPlaylists,
  getUserPlaylists
};
