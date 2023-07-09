async function fetchAndRenderPlaylists(UserOrAllPLaylists) {
  const select = document.getElementById("playlist");

  try {
    let response;
    if (UserOrAllPLaylists === "user") {
      response = await axios.get("/getUserPlaylists", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
    } else {
      response = await axios.get("/getAllPlaylists", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
    }

    const data = response.data;

    if (response.status === 200) {
      data.forEach((obj) => render(obj));
    } else {
      console.error("Failed to fetch playlists:", data.error);
    }
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }

  function render(playlist) {
    const option = document.createElement("option");
    option.value = playlist.name;
    const content = document.createTextNode(`${playlist.name}`);
    option.appendChild(content);
    select.appendChild(option);
  }
}

async function fetchAndRenderSongsToBox(playlistName) {
  try {
    const response = await axios.get(`/getPlaylist`, {
      params: { playlist: playlistName },

      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      const playlist = response.data;
      const songsDropdown = document.getElementById("song-select");
      songsDropdown.innerHTML = "";

      playlist.songs.forEach((song) => {
        const option = document.createElement("option");
        option.value = song.title;
        option.text = song.title;
        songsDropdown.appendChild(option);
      });
    } else {
      console.log("Failed to fetch playlist. Please try again.");
    }
  } catch (error) {
    console.log("An error occurred while fetching the playlist. Please try again.");
  }
};

async function fetchAndRenderSongsToContainer(playlistName) {
  try {
    const response = await axios.get(`/getPlaylist`, {
      params: { playlist: playlistName },

      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      const data = response.data;
      const songList = document.getElementById("song-list");
      songList.innerHTML = "";

      data.songs.forEach((song) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${song.title} - ${song.artist} (${song.duration})`;
        songList.appendChild(listItem);
      });
      songsContainer.style.display = "block";
    } else {
      console.log("Failed to fetch playlist:", data.error);
    }
  } catch (error) {
    console.log("Error fetching playlist:", error);
  }
}
module.exports = { fetchAndRenderPlaylists, fetchAndRenderSongsToBox, fetchAndRenderSongsToContainer };
