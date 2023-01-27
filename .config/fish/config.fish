set -xg EDITOR "code --wait"

# places
abbr -aU ~ 'cd ~'
abbr -aU - 'cd -'
abbr -aU docs 'cd ~/Documents'
abbr -aU down 'cd ~/Downloads'
abbr -aU desk 'cd ~/Desktop'
abbr -aU src 'cd ~/Documents/src'

# alloy
abbr -a -U alloy cd /workspaces/github/vendor/alloy
abbr -a -U anrd npm run dev --prefix /workspaces/github/vendor/alloy
abbr -a -U ani npm install --prefix /workspaces/github/vendor/alloy

# Rails stuff
abbr -a -U ss script/server
abbr -a -U sss script/dx/server-start
abbr -a -U sst script/dx/server-stop
abbr -a -U ssl script/dx/server-logs
abbr -a -U sb script/bootstrap
abbr -a -U br bin/rails
abbr -a -U brt bin/rails test
abbr -a -U bbe bin/bundle exec
abbr -a -U bg bin/guard # run tests in watch mode

# Rails npm stuff
abbr -a -U bn bin/npm
abbr -a -U bni bin/npm install
abbr -a -U bnr bin/npm run
abbr -a -U bns bin/npm start
abbr -a -U bnt bin/npm test
abbr -a -U bntw bin/npm run test:watch

# overmind
abbr -a -U o overmind
abbr -a -U oc overmind connect
abbr -a -U os overmind start
abbr -a -U ost overmind stop
abbr -a -U ors overmind restart

# npm stuff
abbr -a -U n npm
abbr -a -U ni npm install
abbr -a -U nr npm run
abbr -a -U nrd npm run dev
abbr -a -U ns npm start
abbr -a -U nt npm test

# Muscle memory git
abbr -a -U gpf git push --force-with-lease
abbr -a -U gco- git checkout -
abbr -a -U gco. git checkout .
abbr -a -U gcob git checkout -b theinterned/

abbr -a -U cww coworking-with 
abbr -a -U cwws coworking-with --stop

# Codespaces
abbr -a -U ncs 'gh cs code -c "$(gh cs create -r github/github --default-permissions)"'

# shortcut to this project
abbr -a -U dotfiles cd ~/.dotfiles
abbr -a -U config ~/.dotfiles/script/setup.fish

# Other
abbr -a -U ffon bin/toggle-feature-flag enable
abbr -a -U ffoff bin/toggle-feature-flag disable

if  [ "$FISH_SETUP_DONE" != "true" ]
  echo "🍥 fish not setup yet"
  set -Ux FISH_SETUP_DONE "true"
  source $__fish_config_dir/setup.fish
end

starship init fish | source