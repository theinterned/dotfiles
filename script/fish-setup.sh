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
    mkdir -p $FISH_CONFIG_DIR
    touch -a $FISH_CONFIG
fi
chmod +w $FISH_CONFIG

# install fisher and plugins

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

fish -c 'source $FISH_CONFIG'
