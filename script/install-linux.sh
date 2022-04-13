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
  # git-delta – not availble in debian / apt :( https://github.com/dandavison/delta/issues/26
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
echo "📦 Installing Rust and Cargo"
echo

curl https://sh.rustup.rs -sSf | sh -s -- -y

source $HOME/.cargo/env

echo
echo "🌳 Installing Git Delta via Cargo"
echo

# https://crates.io/crates/git-delta
cargo install git-delta

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