#!/usr/bin/env fish

echo
echo
echo "##################################################"
echo "####### Seting-up fisher ########"
echo "##################################################"
echo
echo

set FISH_CONFIG $HOME/.config/fish/config.fish

# install fisher and plugins

curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

fisher install jhillyerd/plugin-git # oh-my-zsh git aliases https://github.com/jhillyerd/plugin-git
fisher install jethrokuan/z # jump to directory with memory https://github.com/jethrokuan/z
fisher install jethrokuan/fzf # command-line fuzzy finder https://github.com/jethrokuan/fzf

# if [ "(grep -c starship $FISH_CONFIG)" = "0" ]
#   echo "Using starship prompt"
#   echo >> $FISH_CONFIG
#   echo "starship init fish | source" >> $FISH_CONFIG
# end

source $FISH_CONFIG
