require('dotenv').config();
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs');

axios.get(`http://${process.env.PLEX_SERVER_ADDR}:32400/status/sessions?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}`)
  .then(response => {
    const sessions = response.data.MediaContainer.Metadata;
    if (sessions && sessions.length > 0) {
      const currentSong = sessions[0];
      const albumArtUrl = `http://${process.env.PLEX_SERVER_ADDR}:32400${currentSong.thumb}?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}&minSize=1`;
      const songTitle = currentSong.title;
      const artist = currentSong.grandparentTitle;

      const canvas = createCanvas(64, 32);
      const ctx = canvas.getContext('2d');

      // Load album art
      loadImage(albumArtUrl).then(img => {
        ctx.drawImage(img, 0, 0, 32, 32);
        // Draw text
        ctx.textAlign = 'right';
        ctx.font = 'bold 8px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(songTitle, 63, 10);
        ctx.fillText(artist, 63, 20);
        // Convert canvas to base64 image
        const base64Image = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        // Write image to file
        fs.writeFile('song-info.gif', buffer, err => {
          if (err) {
            console.log(`Error writing file: ${err}`);
          } else {
            console.log('Image saved successfully!');
          }
        });
      }).catch(err => {
        console.log(`Error loading image: ${err}`);
      });
    } else {
      console.log('No sessions found');
    }
  })
  .catch(error => {
    console.log(`Error getting current song: ${error}`);
  });
