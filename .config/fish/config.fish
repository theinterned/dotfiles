#!/usr/bin/env fish

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
# Temporary fix for VS Code setup breaking in fish
if test -z "$(code --version)"
  # Update this SHA when VS Code updates
  set CODE_VERSION 252e5463d60e63238250799aef7375787f68b4ee
  echo "Patching VS CODE PATHS for VS Code $CODE_VERSION"
  fish_add_path -P /vscode/bin/linux-x64/$CODE_VERSION/bin/
  fish_add_path -P /vscode/bin/linux-x64/$CODE_VERSION/bin/remote-cli/
  fish_add_path -P /vscode/bin/linux-x64/$CODE_VERSION/bin/helpers/
  echo "\n$PATH\n"
end
# https://code.visualstudio.com/docs/terminal/shell-integration#_manual-installation
# https://github.com/microsoft/vscode/issues/139400
string match -q "$TERM_PROGRAM" "vscode"
and . (code --locate-shell-integration-path fish)

if type -q starship
  starship init fish | source
end

function __check_nvm --on-variable PWD --description 'attempt to install node version from .nvmrc'
  status --is-command-substitution; and return
  nvm install 2>/dev/null
end
__check_nvm
