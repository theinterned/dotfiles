#!/bin/bash

# Install dotfiles into home directory
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

DOTFILESDIR=$(dirname $SCRIPTPATH)

DOTFILES=$(ls -a $DOTFILESDIR)

echo "SCRIPTPATH: $SCRIPTPATH"
echo "DOTFILESDIR: $DOTFILESDIR"
echo "DOTFILES: $DOTFILES"

# Move dotfiles to home directory
echo
echo
echo "##################################################"
echo "####### Linking dotfiles to home directory ########"
echo "##################################################"
echo
echo

for DOTFILE in $DOTFILES; do
  HOMEFILE="$HOME/$DOTFILE"
  [ -d $DOTFILE ] && DOTFILE="$DOTFILE/"
  DIRFILE="$DOTFILESDIR/$DOTFILE"

  # Don't mess with Codespaces' default GPG/SSH setup.
  if [ -n "$CODESPACES" ]
  then
    echo $DOTFILE | egrep -q '^(gnupg|ssh)/' && continue
  fi

  # Don't try to install documentation/script files
  echo $DOTFILE | egrep -q '(^script/$|\.txt$|\.md$)' && continue

  # Don't try to install documentation/script/lock files
  echo $DOTFILE | egrep -q '(./$|^script/$|setup.sh|\.txt$|\.md$)' && continue

  echo "DOTFILE $DOTFILE"
  echo "DIRFILE $DIRFILE"
  echo "HOMEFILE $HOMEFILE"
  echo 

  ln -fs $DIRFILE $HOMEFILE
done

# copyy fish config
ln -fs $DOTFILESDIR/.config/fish $HOME/.config/fish

HOMEDOTFILES="$HOME/.dotfiles"
if [ "$DOTFILESDIR" != "$HOMEDOTFILES" ]
then
  ln -sf "$DOTFILESDIR" "$HOMEDOTFILES"
fi

# Fix up permissions for Codespaces
if [ -n "$CODESPACES" ]
then
  chmod 700 /workspaces
fi

echo
echo
echo "##################################################"
echo "####### DONE! ########"
echo "##################################################"
echo
echo

ls -la $HOME

$SCRIPTPATH/install-packages.sh