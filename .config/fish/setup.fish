#!/usr/bin/env fish

echo "🐟 Setting up fish"

# setup fisher if not already installed
if not functions -q fisher
  echo 
  echo "🎣 Installing fisher package manager"
  echo

  curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source
end