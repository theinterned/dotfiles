#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Copy link as Markdown
# @raycast.mode silent

# Optional parameters:
# @raycast.icon /Applications/Safari.app/Contents/Resources/AppIcon.icns

# Documentation:
# @raycast.description Copies a link to Safari's foreground tab to the clipboard
# @raycast.author Jonathan Clem
# @raycast.authorURL https://jclem.net

tell application "Safari"
  set theName to get name of front document
  set theURL to get the URL of front document
  set theLink to "[" & theName & "](" & theURL & ")"
end tell

set the clipboard to theLink