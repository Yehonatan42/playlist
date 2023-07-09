const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

const songSchema = new Schema({
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
    type: String,
    validate: {
      validator: function (value) {
        return moment(value, 'mm:ss', true).isValid();
      },
      message: 'Invalid time duration format. Please use mm:ss format.',
    },
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
