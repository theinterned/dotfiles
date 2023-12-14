#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Spotify Volume Down
# @raycast.mode silent

# Optional parameters:
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify Volume

# Documentation:
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

tell application "Spotify"
  set current_vol to get sound volume

  -- volume wraps at 0 to 100
  if current_vol < 6 then
    set next_vol to 0
  else
    set next_vol to current_vol - 4
  end if

  set sound volume to next_vol
end tell

return "Spotify volume is now: " & next_vol as string & "%"