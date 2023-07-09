const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  ApiId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
