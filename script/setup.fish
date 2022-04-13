# setup fisher if not already installed
if not functions -q fisher
  echo 
  echo "🎣 Installing fisher package manager"
  echo
  
  curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher
  
  echo 
  echo "🐡 Installing fisher plugins"
  echo
  fisher update
end

echo
echo "📜 NVM setup"

if not nvm list lts > /dev/null
  nvm install lts
  set --universal nvm_default_version lts
end

nvm list
echo