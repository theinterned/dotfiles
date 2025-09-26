#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Compress Video
# @raycast.mode fullOutput

# Optional parameters:
# @raycast.icon 🤖
# @raycast.argument1 { "type": "text", "placeholder": "New video name (without extension)" }
# @raycast.packageName Video Compressor

# Documentation:
# @raycast.description Compress the latest video in the ~/Desktop directory. Designed for demo videos captured with CleanShotX tool.
# @raycast.author luanzeba
# @raycast.authorURL https://raycast.com/luanzeba

newest_mp4_path=$(find ~/Desktop -maxdepth 1 -type f -name "*.mp4" -print0 | xargs -0 stat -f "%m %N" | sort -rn | head -1 | cut -f2- -d' ')
new_name="$1"
new_path="$HOME/Desktop/${new_name}.mp4"
compressed_path="$HOME/Desktop/${new_name}-compressed.mp4"
echo "Renaming video..."
echo "Old video name: $newest_mp4_path"
echo "New video name: $new_path"
echo "Compressing video..."
echo "Uncompressed video path: $new_path"
echo "Compressed video path: $compressed_path"
mv "$newest_mp4_path" "$new_path"
ffmpeg -i "$new_path" -vcodec libx264 -crf 18 -preset slow -acodec copy "$compressed_path"