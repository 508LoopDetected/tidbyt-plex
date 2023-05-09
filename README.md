# Plex "Now Playing" for TidByt
A Work in Progress: This Node app aims to send Plex API data from a local media library to Tidbyt's Pixlet runtime for a nice "now playing" type display.

First run `npm install`, then create a `.env` with the server address + auth token:

    PLEX_SERVER_ADDR=server_ip_here
    PLEX_AUTH_TOKEN=auth_token_here

Assuming Plex or Plexamp is currently playing something, run `npm test` to see the result in your console.

That's all I've got so far. To be continued.
