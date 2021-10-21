#!/bin/bash
echo
echo
echo "###########################################################"
echo "####### MacOS: Installing apps and packages via Homebrew #"
echo "###########################################################"
echo
echo

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo
echo "🍺 Install homebrew"
echo

which brew > /dev/null
if [ "$?" != "0" ]
then
  echo
  echo "Installing Homebrew"
  echo

  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo
echo "🍻 Running brew bundle"
echo

brew bundle --file=$HOME/Brewfile