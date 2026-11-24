#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title Connect Spotify to Amp
# @raycast.mode compact
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify
# @raycast.description Connect Spotify to Amp (Office) using its device picker.
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

exec /usr/bin/osascript -l JavaScript "$(dirname "$0")/../lib/spotify-connect.js" "Amp (Office)"
