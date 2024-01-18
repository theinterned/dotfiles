#!/bin/bash
echo
echo
echo "###########################"
echo "####### MacOS Setup #######"
echo "###########################"
echo
echo

# Specify the preferences directory
defaults write com.googlecode.iterm2.plist PrefsCustomFolder -string "$HOME/.dotfiles/iterm/"
# Tell iTerm2 to use the custom preferences in the directory
defaults write com.googlecode.iterm2.plist LoadPrefsFromCustomFolder -bool true

echo
echo "✅ MacOS setup complete"
echo