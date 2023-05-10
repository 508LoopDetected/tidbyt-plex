# Plex "Now Playing" for Tidbyt
A Work in Progress: This Node app aims to send Plex API data from a local media library to Tidbyt's Pixlet runtime for a nice "now playing" type display.

First run `npm install`, then create an `.env` with the server address + auth token:

    PLEX_SERVER_ADDR=server_ip_here
    PLEX_AUTH_TOKEN=auth_token_here
    TIDBYT_DEVICE_ID=device_id_here
    TIDBYT_API_TOKEN=device_token_here

Assuming Plex or Plexamp is currently playing something, run `npm test` to see the result in your console. A Tidbyt-ready image will appear in the app folder, as well.

That's all I've got so far. To be continued.