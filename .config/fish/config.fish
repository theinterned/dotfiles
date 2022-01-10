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
echo
nvm install lts
set --universal nvm_default_version lts
nvm list

starship init fish | source

set -xg EDITOR "code --wait"

# Rails stuff
abbr -a -U ss script/server
abbr -a -U br bin/rails
abbr -a -U brt bin/rails test
abbr -a -U bbe bin/bundle exec
abbr -a -U bg bin/guard # run tests in watch mode
abbr -a -U bn bin/npm
abbr -a -U bnt bin/npm test

# npm stuff
abbr -a -U n npm
abbr -a -U ni npm install
abbr -a -U nr npm run
abbr -a -U ns npm start
abbr -a -U nt npm test

# Muscle memory git
abbr -a -U gpf git push --force-with-lease
abbr -a -U gco- git checkout -
abbr -a -U gcob git checkout -b theinterned/


# shortcut to this project
abbr -a -U dotfiles cd ~/.dotfiles/