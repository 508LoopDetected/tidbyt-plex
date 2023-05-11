# Plex "Now Playing" for Tidbyt
A work in progress: This Node.js app sends Plex API data from your local music library to a registered Tidbyt device for a nice "now playing" display. We're bypassing the Pixlet runtime in this particular instance and utilizing the unofficial [Tidbyt Node client](https://github.com/drudge/node-tidbyt) instead.

### Getting Started

After running `npm install`, create a `.env` with the following credentials:

    PLEX_SERVER_ADDR=server_ip_here
    PLEX_AUTH_TOKEN=auth_token_here
    TIDBYT_DEVICE_ID=device_id_here
    TIDBYT_API_TOKEN=device_token_here

Assuming Plex or Plexamp is currently playing something, run `npm test` to see the result in your console. A 64x32 image of song metadata should instantaneously upload to your Tidbyt's app rotation.

### To-Do

- Delete image after push
- Fix font dependency
- Build a listener for when Plex API plays a new file
- Add Express to keep app alive on local NAS or web hosting
- Setup a default "no artwork found" image