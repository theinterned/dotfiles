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