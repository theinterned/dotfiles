#!/bin/bash

echo
echo
echo "##################################################"
echo "####### Fish shell setup #########################"
echo "##################################################"
echo
echo

echo 
echo "🐟 Using fish as default shell"
echo
# Setup Fish
# Use the Homebrew-managed fish path directly — `which fish` may not resolve
# correctly in non-interactive bash sessions where Homebrew isn't in PATH yet.
FISH_PATH="$(brew --prefix)/bin/fish"

if [ $(grep -c "$FISH_PATH" /etc/shells) = "0" ]
then
  echo "Please enter your password to add fish to available shells"
  echo "$FISH_PATH" | sudo tee -a /etc/shells
fi

if [ "$(echo $SHELL)" != "$FISH_PATH" ]
then
  echo "Using Fish shell"
  sudo chsh -s "$FISH_PATH"
else
  echo "Already using Fish!"
fi

echo
echo "✅ Fish setup complete"
echo
