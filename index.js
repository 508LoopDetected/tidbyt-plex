require('dotenv').config();
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const Tidbyt = require('tidbyt')

axios.get(`http://${process.env.PLEX_SERVER_ADDR}:32400/status/sessions?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}`)
  .then(response => {

    // testing Tidbyt API responses
    async function main() {
        const deviceId = process.env.TIDBYT_DEVICE_ID
        const tidbyt = new Tidbyt(process.env.TIDBYT_API_TOKEN)

        // get our requested device
        const device = await tidbyt.devices.get(deviceId)
        const { displayName, lastSeen } = device

        console.log(displayName, `Last Seen: (${lastSeen})`)

        // get a list of officially available apps
        // return as map so we can lookup app name/descriptions by id
        const apps = await tidbyt.apps.list({ asMap: true })

        // get the list of installations for this device
        const installations = await device.installations.list()

        for (const { id, appID } of installations) {
            const {
                name = 'Custom',
                description = `Unlike a regular Tidbyt app, this "installation" was pushed to ${displayName} via Tidbyt's API.`,
            } = apps.get(appID) || {}

            console.log(``)
            console.log(`  ${name} - ${id}`)
            console.log(`      ${description}`)
        }
    }
    main()

    // Get Plex current song + save to GIF
    const sessions = response.data.MediaContainer.Metadata;
    if (sessions && sessions.length > 0) {
      const currentSong = sessions[0];
      const albumArtUrl = `http://${process.env.PLEX_SERVER_ADDR}:32400${currentSong.thumb}?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}&minSize=1`;
      const songTitle = currentSong.title;
      const artist = currentSong.grandparentTitle;

      const canvas = createCanvas(64, 32);
      const ctx = canvas.getContext('2d');

      // Set background color
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

            // Read the contents of the file into a buffer
            fs.readFile('song-info.gif', (err, data) => {
              if (err) {
                console.log(`Error reading file: ${err}`);
              } else {
                // Push the buffer to Tidbyt
                const deviceId = process.env.TIDBYT_DEVICE_ID
                const tidbyt = new Tidbyt(process.env.TIDBYT_API_TOKEN)
                tidbyt.devices.push(deviceId, data, { installationID: 'plextest', background: false });
              }
            });
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
