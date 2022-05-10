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

  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

  sudo apt update

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