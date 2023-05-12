require('dotenv').config();
const cron = require('node-cron');
const { createCanvas, loadImage, registerFont } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const Tidbyt = require('tidbyt');

// first let's calculate text wrap
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var lines = [];
  var line = '';
  for (var i = 0; i < words.length; i++) {
    var testLine = line + words[i] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  for (var j = 0; j < lines.length; j++) {
    var lineY = y - (lines.length - j - 1) * lineHeight;
    context.fillText(lines[j], x, lineY);
  }
}

// main app functionality
let previousSong = null;
const fetchCurrentSong = async () => {
  try {
    // get current Plex session
    const response = await axios.get(`http://${process.env.PLEX_SERVER_ADDR}:32400/status/sessions?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}`);
    const sessions = response.data.MediaContainer.Metadata;
    if (sessions && sessions.length > 0) {
      const currentSong = sessions[0];
      const albumArtUrl = `http://${process.env.PLEX_SERVER_ADDR}:32400${currentSong.thumb}?X-Plex-Token=${process.env.PLEX_AUTH_TOKEN}&minSize=1`;
      const songTitle = currentSong.title;
      const artist = currentSong.grandparentTitle;

      // Compare with the previous song information
      if (!previousSong || currentSong.title !== previousSong.title) {
        // Changes detected...
        previousSong = currentSong;
        console.log('Now Playing:');
        console.log(`      ${artist} - "${songTitle}"`);

        // setup canvas
        const canvas = createCanvas(64, 32);
        const ctx = canvas.getContext('2d');
        registerFont('./res/monobit.ttf', { family: 'monobit' });

        // draw bg
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // scale + crop album art to bg
        const img = await loadImage(albumArtUrl);
        const aspectRatio = img.width / img.height;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        if (aspectRatio > canvasAspectRatio) {
          sourceWidth = img.height * canvasAspectRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          sourceHeight = img.width / canvasAspectRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvasWidth, canvasHeight);

        // gradient overlay
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 32);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - 32, canvas.width, 32);

        // draw text
        ctx.textAlign = 'left';
        ctx.font = '16px monobit';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        wrapText(ctx, songTitle.toUpperCase(), 2, canvas.height - 1, canvas.width - 0, 6);
        ctx.fillStyle = '#ffffff';
        wrapText(ctx, songTitle.toUpperCase(), 1, canvas.height - 1, canvas.width - 0, 6);

        // write to file and deploy to Tidbyt
        const base64Image = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        fs.writeFile('res/songinfo.gif', buffer, err => {
          if (err) {
            console.log(`Error writing file: ${err}`);
          } else {
            fs.readFile('res/songinfo.gif', (err, data) => {
              if (err) {
                console.log(`Error reading file: ${err}`);
              } else {
                tidbytDeploy(data);
                fs.unlink('res/songinfo.gif', (err) => {});
              }
            });
          }
        });

      } else {
        // console.log('No changes detected.');
      }

    } else {
      // console.log('Nothing seems to be playing...');
    }
  } catch (error) {
    console.log(`Error getting current song: ${error}`);
  }
};

// push to specified Tidbyt
const tidbytDeploy = async (data) => {
  const deviceId = process.env.TIDBYT_DEVICE_ID;
  const tidbyt = new Tidbyt(process.env.TIDBYT_API_TOKEN);
  const deviceObj = await tidbyt.devices.get(deviceId);
  const { displayName, lastSeen } = deviceObj;
  // console.log(displayName, `was found! Last seen on ${lastSeen}`);
  const options = {
    installationID: 'plexmusic',
    background: false,
    app: {
      name: 'Plex Now Playing',
      description: `Hello ${displayName}! Display the currently playing song from your local Plex API.`,
      appID: 'plexdisplay'
    }
  };
  await tidbyt.devices.push(deviceId, data, options);
  // list all current apps
  /*const apps = await tidbyt.apps.list({ asMap: true });
  const installations = await deviceObj.installations.list();
  for (const { id, appID } of installations) {
    const { name = 'Plex Now Playing', description = `Hello ${displayName}! Display the currently playing song from your local Plex API.` } = apps.get(appID) || {};

    console.log(``);
    console.log(`  ${name} - ${id}`);
    console.log(`      ${description}`);
  }*/
};

// run every 5 seconds
const checkPlexAPI = () => {
  cron.schedule('*/5 * * * * *', () => {
    fetchCurrentSong();
  });
};
checkPlexAPI();