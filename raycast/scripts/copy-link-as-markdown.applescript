#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Copy link as Markdown
# @raycast.mode silent

# Optional parameters:
# @raycast.icon /Applications/Safari.app/Contents/Resources/AppIcon.icns

# Documentation:
# @raycast.description Copies a link to Safari's foreground tab to the clipboard
# @raycast.author Ned Schwartz
# @raycast.authorURL https://theinterned.net

use framework "Foundation"
use scripting additions

tell application "Safari"
	set theName to get name of front document
	set theURL to get the URL of front document
end tell

set howiePrefix to "\\[(.*)\\]"
set howieReplacement to "$1\\:"

set theName to re_match from theName against howiePrefix given replacement:howieReplacement

on re_match against pattern from str given replacement:fmt
	set regex to current application's NSRegularExpression's regularExpressionWithPattern:pattern options:(current application's NSRegularExpressionCaseInsensitive) |error|:(missing value)
	return (regex's stringByReplacingMatchesInString:str options:0 range:{0, length of str} withTemplate:fmt) as text
end re_match

set theLink to "[" & theName & "](" & theURL & ")"

set the clipboard to theLink

return theLink