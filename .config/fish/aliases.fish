#!/usr/bin/env fish

# places
abbr -aU ~ 'cd ~'
abbr -aU - 'cd -'
abbr -aU docs 'cd ~/Documents'
abbr -aU down 'cd ~/Downloads'
abbr -aU desk 'cd ~/Desktop'
abbr -aU src 'cd ~/Documents/src'

# shortcut to this project
abbr -aU dotfiles cd ~/.dotfiles
abbr -aU config ~/.dotfiles/script/setup.fish

# alloy
abbr -aU alloy cd /workspaces/github/vendor/alloy
abbr -aU anrd npm run dev --prefix /workspaces/github/vendor/alloy
abbr -aU ani npm install --prefix /workspaces/github/vendor/alloy

# npm stuff
abbr -aU n npm
abbr -aU ni npm install
abbr -aU nr npm run
abbr -aU nrd npm run dev
abbr -aU ns npm start
abbr -aU nt npm test
abbr -aU ntw npm test:watch

# Rails npm stuff
abbr -aU bn bin/npm
abbr -aU bni bin/npm install
abbr -aU bnr bin/npm run
abbr -aU bns bin/npm start
abbr -aU bnt bin/npm test
abbr -aU bntw bin/npm run test:watch

# Rails stuff
abbr -aU ss script/server
abbr -aU ssmd "gh medic && script/server"
abbr -aU ghm "gh medic"
abbr -aU ssd script/server --debug
abbr -aU sss script/dx/server-start
abbr -aU sst script/dx/server-stop
abbr -aU ssl script/dx/server-logs
abbr -aU sb script/bootstrap
abbr -aU br bin/rails
abbr -aU brt bin/rails test
abbr -aU brtc bin/rails test_changes
abbr -aU bbe bin/bundle exec
abbr -aU bg bin/guard # run tests in watch mode

# Stuff
abbr -aU bgsf bin/generate-service-files.rb

# overmind
abbr -aU o overmind
abbr -aU oc overmind connect
abbr -aU os overmind start
abbr -aU ost overmind stop
abbr -aU ors overmind restart

# Codespaces
abbr -aU ncs 'gh cs code -c "$(gh cs create -r github/github --default-permissions)"'

# Muscle memory git
abbr -aU gpf git push --force-with-lease
abbr -aU gco- git checkout -
abbr -aU gco. git checkout .
abbr -aU gcob git checkout -b ns/
abbr -aU gdst git diff --staged

abbr -aU cww coworking-with 
abbr -aU cwws coworking-with --stop

# Other
abbr -aU c code
abbr -aU edit code
abbr -aU e edit

abbr -aU ffon bin/toggle-feature-flag enable
abbr -aU ffoff bin/toggle-feature-flag disable

# fix a garbled terminal
# https://www.oreilly.com/library/view/bash-cookbook/0596526784/ch19s09.html
abbr -aU sane stty sane
