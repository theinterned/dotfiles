#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Spotify Volume Up
# @raycast.mode silent

# Optional parameters:
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify Volume

# Documentation:
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

tell application "Spotify"
  set current_vol to get sound volume

  -- volume wraps at 100 to 0
  if current_vol > 94 then
    set next_vol to 100
  else
    set next_vol to current_vol + 5
  end if

  set sound volume to next_vol
end tell

return "Spotify volume is now: " & next_vol as string & "%"