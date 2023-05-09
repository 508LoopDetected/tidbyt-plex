require('dotenv').config();

const axios = require('axios');

axios.get(`http://${process.env.PLEX_SERVER_ADDR}:32400/status/sessions?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}`)
  .then(response => {
    const sessions = response.data.MediaContainer.Metadata;
    if (sessions && sessions.length > 0) {
      const currentSong = sessions[0].title;
      console.log(`Currently playing song: ${currentSong}`);
    } else {
      console.log('No sessions found');
    }
  })
  .catch(error => {
    console.log(`Error getting current song: ${error}`);
  });
