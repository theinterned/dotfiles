#!/usr/bin/env fish

# places
abbr -a ~ 'cd ~'
abbr -a - 'cd -'
abbr -a docs 'cd ~/Documents'
abbr -a down 'cd ~/Downloads'
abbr -a desk 'cd ~/Desktop'
abbr -a src 'cd ~/Documents/src'

# shortcut to this project
abbr -a dotfiles cd ~/.dotfiles
abbr -a config ~/.dotfiles/script/setup.fish

# alloy
abbr -a alloy cd /workspaces/github/vendor/alloy
abbr -a anrd npm run dev --prefix /workspaces/github/vendor/alloy
abbr -a ani npm install --prefix /workspaces/github/vendor/alloy

# npm stuff
abbr -a n npm
abbr -a ni npm install
abbr -a nr npm run
abbr -a nrd npm run dev
abbr -a ns npm start
abbr -a nt npm test
abbr -a ntw npm test:watch

# Rails npm stuff
abbr -a bn bin/npm
abbr -a bni bin/npm install
abbr -a bnr bin/npm run
abbr -a bns bin/npm start
abbr -a bnt bin/npm test
abbr -a bntw bin/npm run test:watch

# Rails stuff
abbr -a ss script/server
abbr -a ssmd "gh medic && script/server"
abbr -a ghm "gh medic"
abbr -a ssd script/server --debug
abbr -a sss script/dx/server-start
abbr -a sst script/dx/server-stop
abbr -a ssl script/dx/server-logs
abbr -a sb script/bootstrap
abbr -a br bin/rails
abbr -a brt bin/rails test
abbr -a brtc bin/rails test_changes
abbr -a bbe bin/bundle exec
abbr -a bg bin/guard # run tests in watch mode

# Stuff
abbr -a bgsf bin/generate-service-files.rb

# overmind
abbr -a o overmind
abbr -a oc overmind connect
abbr -a os overmind start
abbr -a ost overmind stop
abbr -a ors overmind restart

# Codespaces
abbr -a ncs 'gh cs code -c "$(gh cs create -r github/github --default-permissions)"'

# Muscle memory git
abbr -a gpf git push --force-with-lease
abbr -a gco- git checkout -
abbr -a gco. git checkout .
abbr -a gcob git checkout -b ns/
abbr -a gdst git diff --staged

abbr -a cww coworking-with 
abbr -a cwws coworking-with --stop

# Other
abbr -a c code
abbr -a edit code
abbr -a e edit

abbr -a ffon bin/toggle-feature-flag enable
abbr -a ffoff bin/toggle-feature-flag disable

# fix a garbled terminal
# https://www.oreilly.com/library/view/bash-cookbook/0596526784/ch19s09.html
abbr -a sane stty sane
