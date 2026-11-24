#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title Connect Spotify to This Computer
# @raycast.mode compact
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify
# @raycast.description Connect Spotify to this computer using its device picker.
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

exec "$(dirname "$0")/spotify-connect-amp.js" --computer
