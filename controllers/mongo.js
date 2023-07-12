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
      return res.status(404).json({ message: "User not found" });
    }

    const existingPlaylist = await Playlist.findOne({
      name: playlistName,
      owner: user._id,
    });
    if (existingPlaylist) {
      return res.status(409).json({ message: "Playlist already exists" });
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
    console.error(error);
    res.status(500).json({ message: "Error creating playlist" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.query.playlist;

    const searchedUser = await User.findById(userId);
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await searchedUser.populate("playlists");
    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await user.updateOne({ $pull: { playlists: searchedPlaylist._id } });

    if (searchedPlaylist.owner._id.equals(user._id)) {
      await Playlist.deleteOne({ _id: searchedPlaylist._id });
    }
    await user.save();

    console.log("Playlist deleted successfully");
    res.status(200).json(searchedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting playlist" });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.body.playlist;
    const title = req.body.title;
    const artist = req.body.artist;
    const duration = req.body.duration;
    
    const searchedUser = await User.findById(userId);
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await searchedUser.populate("playlists");
    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const playlist = await Playlist.findById(searchedPlaylist._id);

    const existingSong = await Song.findOne({ title: title });
    let newSong;

    if (existingSong) {
      newSong = existingSong;
    } else {
      newSong = await Song.create({
        title: title,
        artist: artist,
        duration: duration,
      });
    }

    if (!playlist.songs.includes(newSong._id)) {
      playlist.duration += newSong.duration;
      playlist.songs.push(newSong._id);
      await playlist.save();
    }
    
    console.log("Song added successfully");
    res.status(200).json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding songs" });
  }
};

const deleteSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.body.playlist;
    const title = req.body.title;
    
    const searchedUser = await User.findById(userId);
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await searchedUser.populate("playlists");
    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const playlist = await searchedPlaylist.populate("songs");
    const song = playlist.songs.find((song) => song.title === title);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    playlist.songs.pull({ _id: song._id });
    playlist.duration -= song.duration;
    await playlist.save();

    console.log("Song deleted successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting song from playlist" });
  }
};

const getPlaylist = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const playlistName = req.query.playlist;

    const searchedUser = await User.findById(userId);
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await searchedUser.populate("playlists");
    const searchedPlaylist = user.playlists.find(
      (playlist) => playlist.name === playlistName
    );
    if (!searchedPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const playlist = await searchedPlaylist.populate("songs");

    console.log("Playlist fetched successfully");
    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting playlist" });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.headers.userId;
    const searchedUser = await User.findById(userId);
    if (!searchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await searchedUser.populate("playlists");
    const playlists = user.playlists;
    console.log("Fetched playlists successfully");
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Error fetching playlists" });
  }
};

const getAllPlaylists = async (req, res) => {
  try {
    const searchedPlaylists = await Playlist.find({});

    if (!searchedPlaylists) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const populatedPlaylists = [];

    for (const playlist of searchedPlaylists) {
      const populatedPlaylist = await playlist.populate("owner");
      populatedPlaylists.push(populatedPlaylist);
    }

    console.log("Fetched playlists successfully");
    res.status(200).json(populatedPlaylists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Error fetching playlists" });
  }
};


module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  addToPlaylist,
  deleteSongFromPlaylist,
  getAllPlaylists,
  getUserPlaylists,
};
