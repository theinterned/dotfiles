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

# Muscle memory git
abbr -a -U gpf git push --force-with-lease
abbr -a -U gco- git checkout -
abbr -a -U gcob git checkout -b

# shortcut to this project
abbr -a -U dotfiles cd ~/.dotfiles/