set -U EDITOR "code --wait"

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
  set CODE_VERSION ee2b180d582a7f601fa6ecfdad8d9fd269ab1884
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

starship init fish | source