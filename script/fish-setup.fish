#!/usr/bin/env fish

echo
echo
echo "##################################################"
echo "####### Using fisher shell ########"
echo "##################################################"
echo
echo

# Setup Fish

if [ (grep -c fish /etc/shells) = "0" ]
  echo "Please enter your password to add fish to available shells"
  echo (which fish 2>/dev/null) | sudo tee -a /etc/shells
end

# if [ (which $SHELL) != (which fish) ]
# chsh -s (which fish 2>/dev/null)
# end

echo
echo
echo "##################################################"
echo "####### Seting-up fisher ########"
echo "##################################################"
echo
echo

set FISH_CONFIG $HOME/.config/fish/config.fish
touch $FISH_CONFIG

# install fisher and plugins

curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

fisher install jhillyerd/plugin-git # oh-my-zsh git aliases https://github.com/jhillyerd/plugin-git
fisher install jethrokuan/z # jump to directory with memory https://github.com/jethrokuan/z
fisher install jethrokuan/fzf # command-line fuzzy finder https://github.com/jethrokuan/fzf

if [ (grep -c starship $FISH_CONFIG) = "0" ]
  echo "Using starship prompt"
  echo >> $FISH_CONFIG
  echo "starship init fish | source" >> $FISH_CONFIG
end

source $FISH_CONFIG
