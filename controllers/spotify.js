const axios = require("axios");

const options = {
  method: "GET",
  url: "https://spotify23.p.rapidapi.com/search/",
  params: {
    q: "<REQUIRED>",
    type: "tracks",
    offset: "0",
    limit: "10",
    numberOfTopResults: "5",
  },
  headers: {
    "X-RapidAPI-Key": "41dca12252msh500ce4d16710b4fp1bbbd7jsnd719b5b6ba17",
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

const searchForSongOptions = async (req, res) => {
  try {
    const request = options;
    request.params.q = req.query.songName;
    const response = await axios.request(request);
    const data = response.data;

    if (response.status === 200) {
      const songs = data.tracks.items;
        
      return res.status(500).json(songs);
    } else {
      console.error("Failed to fetch songs:", data.error);
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};

module.exports = { searchForSongOptions };
