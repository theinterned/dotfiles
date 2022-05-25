starship init fish | source

set -xg EDITOR "code --wait"

# Rails stuff
abbr -a -U ss script/server
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

# npm stuff
abbr -a -U n npm
abbr -a -U ni npm install
abbr -a -U nr npm run
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
abbr -a -U dotfiles cd ~/.dotfiles/