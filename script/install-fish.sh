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
# On Linux, brew may not be in PATH (eval'd only in the install-linux.sh subprocess),
# so fall back to the well-known linuxbrew path.
if command -v brew &>/dev/null; then
  FISH_PATH="$(brew --prefix)/bin/fish"
else
  FISH_PATH="/home/linuxbrew/.linuxbrew/bin/fish"
fi

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
