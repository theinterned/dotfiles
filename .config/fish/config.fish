set -xg EDITOR "code --wait"

source $__fish_config_dir/aliases.fish 

if  [ "$FISH_SETUP_DONE" != "true" ]
  echo "🍥 fish not setup yet"
  set -Ux FISH_SETUP_DONE "true"
  source $__fish_config_dir/setup.fish
end

starship init fish | source