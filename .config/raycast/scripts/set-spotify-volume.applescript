#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Set Spotify Volume
# @raycast.mode silent

# Optional parameters:
# @raycast.icon ./Spotify.png
# @raycast.packageName Spotify Volume
# @raycast.argument1 { "type": "text", "placeholder": "%, mute, max, up, or down" }

# Documentation:
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

on run argv

set user_vol to ( item 1 of argv )
set next_vol to user_vol

tell application "Spotify"
	set current_vol to get sound volume

    if user_vol is "mute" then
      set next_vol to 0
    end if

    if user_vol is "max" then
      set next_vol to 100
    end if

    if user_vol is "up" then
       	-- volume wraps at 100 to 0
     	if current_vol > 94 then
	     	set next_vol to 100
		else
			set next_vol to current_vol + 5
		end if

    else if user_vol is "down"
       	-- volume wraps at 0 to 100
     	if current_vol < 6 then
	     	set next_vol to 0
		else
			set next_vol to current_vol - 4
		end if
	end if

    set sound volume to next_vol
end tell

return "Spotify volume is now: " & next_vol as string & "%"

end run