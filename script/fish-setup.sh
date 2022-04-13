#!/bin/bash

echo
echo
echo "##################################################"
echo "####### Fish shell setup #########################"
echo "##################################################"
echo
echo

echo 
echo "🐟 Using fish as default shell"
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
  sudo chsh -s $(which fish 2>/dev/null)
else
  echo "Already using Fish!"
fi
