#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title New Github Codespace
# @raycast.mode compact

# Optional parameters:
# @raycast.icon 🤖
# @raycast.packageName GitHub Codespace
# @raycast.argument1 { "type": "text", "placeholder": "repo", "optional": true}
# @raycast.argument2 { "type": "text", "placeholder": "machine type", "optional": true}

# Documentation:
# @raycast.description Creates a new Codesapce for gh/gh and open it in VS Code
# @raycast.author Ned Schwartz
# @raycast.authorURL https://github.com/theinterned

DEFAULT_REPO="github/github"
REPO=${1:-$DEFAULT_REPO}

# Available machines: [basicLinux32gb standardLinux32gb premiumLinux largePremiumLinux xLargePremiumLinux]
DEFAULT_MACHINE=(--machine xLargePremiumLinux)
MACHINE=${2:$DEFAULT_MACHINE}
# github/github codespaces are prebuilt
if [ $REPO == $DEFAULT_REPO ]; then
  MACHINE=""
fi

NEW_COPDESPACE=$(gh cs create -r $REPO $MACHINE)

gh cs code -c $NEW_COPDESPACE

echo $NEW_COPDESPACE | pbcopy
echo "Created $NEW_COPDESPACE"