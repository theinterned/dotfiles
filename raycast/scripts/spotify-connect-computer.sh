#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title Spotify Connect to This Computer
# @raycast.mode silent
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify
# @raycast.description Connect Spotify to this computer using its device picker.
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

exec /usr/bin/osascript -l JavaScript "$(dirname "$0")/../lib/spotify-connect.js" "This computer" 2>&1
