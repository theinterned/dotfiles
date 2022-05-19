#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title New Github Codespace
# @raycast.mode compact

# Optional parameters:
# @raycast.icon 🤖
# @raycast.packageName GitHub Codespace

# Documentation:
# @raycast.description Creates a new Codesapce for gh/gh and open it in VS Code
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

gh cs code -c "$(gh cs create -r github/github --default-permissions)"

