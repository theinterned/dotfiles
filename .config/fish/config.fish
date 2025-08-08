#!/usr/bin/env fish

if [ -n "$CODESPACES" ]
  # this fixes an error `bash: warning: setlocale: LC_ALL: cannot change locale (C.UTF-8)` I started getting when
  # pushing in a codespace \_(ツ)_/¯
  export LC_ALL="en_US.UTF-8"
end

set -U EDITOR "code --wait"
# Run server in background. See https://github.rewatch.com/video/8pex35764vboieau-script-server-daemonized-demo
set -U FEATURE_DAEMONIZE_SCRIPT_SERVER true

source $__fish_config_dir/aliases.fish 

if  [ "$FISH_SETUP_DONE" != "true" ]
  echo "🍥 fish not setup yet"
  set -Ux FISH_SETUP_DONE "true"
  source $__fish_config_dir/setup.fish
end

#
# VSCode shell integration
#
# https://code.visualstudio.com/docs/terminal/shell-integration#_manual-installation
# https://github.com/microsoft/vscode/issues/139400
string match -q "$TERM_PROGRAM" "vscode"
and . (code --locate-shell-integration-path fish)

fish_config prompt choose arrow

function __check_nvm --on-variable PWD --description 'attempt to install node version from .nvmrc'
  status --is-command-substitution; and return
  nvm install 2>/dev/null
end
__check_nvm

if type -q rbenv
  status --is-interactive; and rbenv init - fish | source
end

# Speed precommit up since I'm really working in rails
set -U SORBET_SKIP 1
set -U RUBOCOP_NEW_ONLY 1