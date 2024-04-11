#!/bin/bash
echo
echo
echo "###########################"
echo "####### MacOS Setup #######"
echo "###########################"
echo
echo

echo
echo "🍺 Install homebrew"
echo

which brew > /dev/null
if [ "$?" != "0" ]
then
  echo
  echo "⬇️ Installing Homebrew"
  echo

  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "✅ Homebrew already installed"
fi

echo
echo "🍻 Running brew bundle"
echo

brew bundle --file=$HOME/Brewfile

echo 
echo "✅ Homebrew bundle complete"
echo

# Specify the preferences directory
defaults write com.googlecode.iterm2.plist PrefsCustomFolder -string "$HOME/.dotfiles/iterm/"
# Tell iTerm2 to use the custom preferences in the directory
defaults write com.googlecode.iterm2.plist LoadPrefsFromCustomFolder -bool true
# Show cmd+tab app switcher on all monitors
defaults write com.apple.Dock appswitcher-all-displays -bool true

echo
echo "✅ MacOS setup complete"
echo