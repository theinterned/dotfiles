#!/bin/bash

echo
echo
echo "##################################################"
echo "####### Fish shell setup #########################"
echo "##################################################"
echo
echo

echo 
echo "🐟 Useing fish as default shell"
echo
# Setup Fish

if [ $(grep -c fish /etc/shells) = "0" ]
then
  echo "Please enter your password to add fish to available shells"
  echo $(which fish 2>/dev/null) | sudo tee -a /etc/shells
fi

if [ $(echo $SHELL) != $(which fish) ]
then
  echo "Using Fish shell"
  chsh -s $(which fish 2>/dev/null)
else
  echo "Already using Fish!"
fi

echo 
echo "🎣 Installing fisher package manager"
echo

FISH_CONFIG_DIR=$HOME/.config/fish
FISH_CONFIG=$FISH_CONFIG_DIR/config.fish

if [[ ! -e $FISH_CONFIG ]]; then
    echo "no fish config found at $FISH_CONFIG"
    mkdir -p $FISH_CONFIG_DIR
    touch -a $FISH_CONFIG
    ls -a $FISH_CONFIG_DIR
fi
chmod +w $FISH_CONFIG

# install fisher and plugins

echo "Installing fisher"

fish -c 'curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher'

echo 
echo "🐡 Installing fisher plugins"
echo

fish -c 'fisher install jhillyerd/plugin-git' # oh-my-zsh git aliases https://github.com/jhillyerd/plugin-git
fish -c 'fisher install jethrokuan/z' # jump to directory with memory https://github.com/jethrokuan/z
fish -c 'fisher install jethrokuan/fzf' # command-line fuzzy finder https://github.com/jethrokuan/fzf
fish -c 'fisher install fisher install jorgebucaran/nvm.fish' # Node.js version manager lovingly made for Fish (nvm officially does not support fish)


echo 
echo "🚤 Using Starship prompt"
echo

if [ "$(grep -c starship $FISH_CONFIG)" = "0" ]
then
  echo "Setting Starship prompt"
  echo "starship init fish | source" >> $FISH_CONFIG
else
  echo "Already using Starship"
fi

echo
echo "📜 NVM setup"
echo

fish -c 'nvm install lts'
fish -c 'set --universal nvm_default_version lts'

fish -c 'source $FISH_CONFIG'
