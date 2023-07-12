const axios = require("axios");
require("dotenv").config();
const spotifyKey = process.env.SPOTIFY_KEY;

const options = {
  method: "GET",
  url: "https://spotify23.p.rapidapi.com/search/",
  params: {
    q: "<REQUIRED>",
    type: "tracks",
    offset: "0",
    limit: "15",
    numberOfTopResults: "5",
  },
  headers: {
    "X-RapidAPI-Key": spotifyKey,
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

const searchForSongOptions = async (req, res) => {
  try {
    const request = options;
    request.params.q = req.query.title;
    
    const response = await axios.request(request);
    const data = response.data;

    if (response.status === 200) {
      const songs = data.tracks.items;
      
      return res.status(200).json(songs);
    } else {
      console.error("Failed to fetch songs:", data.error);
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};


module.exports = { searchForSongOptions };
