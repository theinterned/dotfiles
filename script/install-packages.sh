#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo
echo
echo "##################################################"
echo "####### Installing packages via Homebrew ########"
echo "##################################################"
echo
echo

# Install homebrew
which brew > /dev/null
if [ "$?" != "0" ]
then
  echo
  echo "Installing Homebrew"
  echo

  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

brew bundle

echo
echo
echo "##################################################"
echo "####### Using up fisher shell ########"
echo "##################################################"
echo
echo

# Setup Fish

if [ "$(grep -c fish /etc/shells)" = "0" ]
then
  echo "Please enter your password to add fish to available shells"
  echo "$(which fish 2>/dev/null)" | sudo tee -a /etc/shells
fi

if ["$(which $SHELL)" != "$(which fish)"]
then
  chsh -s $(which fish 2>/dev/null)
fi

$SCRIPTPATH/setup-fisher.fish