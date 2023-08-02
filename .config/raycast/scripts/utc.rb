#!/usr/bin/env ruby

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title UTC time
# @raycast.mode compact
# @raycast.refreshTime 1h

# Optional parameters:
# @raycast.icon utc-light.png
# @raycast.iconDark utc-dark.png

# Documentation:
# @raycast.description EST to UTC
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

# @raycast.argument1 {"type": "text", "placeholder": "time", "optional": true}

require 'time'

def fmt(time)
  time.strftime("%H:%M %Z")
end

time = ARGV[0]

if(!time.nil? && !time.empty?)
  time = "#{time}:00" if time.match?(/^\d.$/)
  now = Time.parse(time)
else
  now = Time.now
end

system `echo "#{fmt now.utc}" | pbcopy`

puts "#{fmt now} is #{fmt now.utc}"

