#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Spotify Volume Mute
# @raycast.mode silent

# Optional parameters:
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify Volume

# Documentation:
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

tell application "Spotify"
  set next_vol to 0
  set sound volume to next_vol
end tell

return "Spotify volume is now: " & next_vol & "%"