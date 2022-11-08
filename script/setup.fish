#!/usr/bin/env fish

# setup fisher if not already installed
if not functions -q fisher
  echo 
  echo "🎣 Installing fisher package manager"
  echo "🐡 Installing fisher plugins"
  echo

  curl -sL https://git.io/fisher | source && fisher update
end

echo
echo "📜 NVM setup"

if not nvm list lts > /dev/null
  nvm install lts
  set --universal nvm_default_version lts
end

nvm list
echo