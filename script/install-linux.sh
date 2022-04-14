#!/bin/bash
echo
echo
echo "##################################################"
echo "####### Linux: Installing packages ###############"
echo "##################################################"
echo
echo

packages=(
  fish
  git
  ack
  asciinema
  bat
  rbenv
  direnv
  gh
  jq
)

if command -v apt &> /dev/null
then
  echo 
  echo "📦 Installing packages via apt"
  echo

  for package in "${packages[@]}"
  do
    sudo apt install -y $package
  done
fi

echo 
echo "🖖 Installing nvm"
echo

# nvm
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

echo 
echo "🚀 Installing Starship"
echo

# starship
FORCE=1 sh -c "$(curl -fsSL https://starship.rs/install.sh)"