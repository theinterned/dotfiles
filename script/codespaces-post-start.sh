#!/bin/sh
# Run by github/github codespaces after starting

# Always want to use Fish as my default shell (e.g. for SSH)
if [ "$(which $SHELL)" != "$(which fish)" ]
then
  chsh -s $(which fish 2>/dev/null)
fi
