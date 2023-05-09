require('dotenv').config();

const axios = require('axios');

axios.get(`http://${process.env.PLEX_SERVER_ADDR}:32400/status/sessions?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}`)
  .then(response => {
    const sessions = response.data.MediaContainer.Metadata;
    if (sessions && sessions.length > 0) {
      const currentSong = sessions[0];
      const albumArt = `http://${process.env.PLEX_SERVER_ADDR}:32400${currentSong.thumb}?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}&minSize=1`;
      const songTitle = currentSong.title;
      const artist = currentSong.grandparentTitle;

      console.log(albumArt);
      console.log(artist);
      console.log(songTitle);

      /*const tidbytMessage = {
        frames: [
          {
            icon: albumArt,
            text: songTitle,
            subtext: artist
          }
        ]
      };

      const options = {
        method: 'POST',
        url: `https://api.tidbyt.com/v0/devices/${process.env.TIDBYT_DEVICE_ID}/push`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TIDBYT_API_TOKEN}`
        },
        data: tidbytMessage
      };

      axios(options)
        .then(response => {
          console.log(`Successfully sent message to Tidbyt device: ${response.data.message_id}`);
        })
        .catch(error => {
          console.log(`Error sending message to Tidbyt device: ${error}`);
        });*/
      
    } else {
      console.log('No sessions found');
    }
  })
  .catch(error => {
    console.log(`Error getting current song: ${error}`);
  });