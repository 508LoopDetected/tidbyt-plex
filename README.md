# Plex "Now Playing" for Tidbyt
A Work in Progress: This Node app aims to send Plex API data from a local media library to a Tidbyt device on the same network for a nice "now playing" type display. We're bypassing the Pixlet runtime in this particular instance and utilizing the unofficial [Node-based Tidbyt API client](https://github.com/drudge/node-tidbyt) instead.

### Getting Started

After running `npm install`, create a `.env` with the following credentials:

    PLEX_SERVER_ADDR=server_ip_here
    PLEX_AUTH_TOKEN=auth_token_here
    TIDBYT_DEVICE_ID=device_id_here
    TIDBYT_API_TOKEN=device_token_here

Assuming Plex or Plexamp is currently playing something, run `npm test` to see the result in your console. A 64x32 image of song info will instantly be added to the Tidbyt device app rotation.

### To-Do

- Build a listener for when Plex API plays a new file
- Add Express to keep app alive on local NAS or web hosting
- Import bitmap font for display text
- Create 2-3 display themes/layouts