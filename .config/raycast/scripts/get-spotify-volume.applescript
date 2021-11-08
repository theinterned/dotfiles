#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Spotify Volume is
# @raycast.mode inline
# @raycast.refreshTime 30s

# Optional parameters:
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify Volume

# Documentation:
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

set vol to 0

tell application "Spotify"
	set vol to get sound volume
end tell

set result to vol as string & "%"
return result

