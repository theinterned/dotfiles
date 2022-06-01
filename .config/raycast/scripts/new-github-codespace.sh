#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title New Github Codespace
# @raycast.mode fullOutput

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
DEFAULT_MACHINE="xLargePremiumLinux"
MACHINE_TYPE=${2:-${DEFAULT_MACHINE}}
# github/github codespaces are prebuilt
if [ $REPO == $DEFAULT_REPO ]; then
  MACHINE=()
else
  MACHINE=(--machine $MACHINE_TYPE)
fi

# echo "gh cs create -r $REPO $MACHINE"
NEW_CODESPACE=$(gh cs create -r $REPO ${MACHINE[@]})

echo $NEW_CODESPACE | pbcopy

gh cs code -c $NEW_CODESPACE

echo "Created $NEW_CODESPACE"