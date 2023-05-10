# Plex "Now Playing" for Tidbyt
A Work in Progress: This Node app aims to send Plex API data from a local media library to Tidbyt's Pixlet runtime for a nice "now playing" type display.

First run `npm install`, then create an `.env` with the server address + auth token:

    PLEX_SERVER_ADDR=server_ip_here
    PLEX_AUTH_TOKEN=auth_token_here
    TIDBYT_DEVICE_ID=device_id_here
    TIDBYT_API_TOKEN=device_token_here

Assuming Plex or Plexamp is currently playing something, run `npm test` to see the result in your console. A 64x32 image of song info will instantly be added to the Tidbyt device app rotation.

### Coming up next:

- Build a listener for when Plex API plays a new file
- Add Express to keep app alive on local NAS or web hosting
- Import bitmap font for display text
- Create 2-3 display themes/layouts