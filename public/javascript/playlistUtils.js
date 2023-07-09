async function fetchAndRenderAllPlaylists(elementId) {

  const select = document.getElementById(elementId);
  try {
    const response = await axios.get("/getAllPlaylists", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

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
    const content = document.createTextNode(
      `${playlist.name} - ${formatTime(playlist.duration)}`
    );
    option.appendChild(content);
    select.appendChild(option);
  }
}

async function fetchAndRenderUserPlaylists(elementId) {
  const select = document.getElementById(elementId);

  try {
    const response = await axios.get("/getUserPlaylists", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

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
    const content = document.createTextNode(
      `${playlist.name}`
    );
    option.appendChild(content);
    select.appendChild(option);
  }
}

async function fetchAndRenderSongsToBox(playlistName, elementId) {
  try {
    const response = await axios.get(`/getPlaylist`, {
      params: { playlist: playlistName },

      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      const playlist = response.data;
      const songsDropdown = document.getElementById(elementId);
      songsDropdown.innerHTML = "";

      playlist.songs.forEach((song) => {
        const option = document.createElement("option");
        option.value = song.title;
        option.textContent = `${song.title} - ${song.artist}`;
        songsDropdown.appendChild(option);
      });
    } else {
      console.log("Failed to fetch playlist. Please try again.");
    }
  } catch (error) {
    console.log(
      "An error occurred while fetching the playlist. Please try again."
    );
  }
}

async function fetchAndRenderSongsToContainer(playlistName, elementId) {
  try {
    const response = await axios.get(`/getPlaylist`, {
      params: { playlist: playlistName },

      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      const data = response.data;
      const songList = document.getElementById(elementId);
      songList.innerHTML = "";

      data.songs.forEach((song) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${song.title} - ${song.artist} (${formatTime(
          song.duration
        )})`;
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

const formatTime = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

  let timeString = "";

  if (hours !== 0) {
    timeString += hours.toString().padStart(2, "0") + ":";
  }

  timeString +=
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return timeString;
};
