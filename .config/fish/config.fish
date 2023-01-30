set -xg EDITOR "code --wait"

source $__fish_config_dir/aliases.fish 

if  [ "$FISH_SETUP_DONE" != "true" ]
  echo "🍥 fish not setup yet"
  set -Ux FISH_SETUP_DONE "true"
  source $__fish_config_dir/setup.fish
end

# VSCode shell integration
# https://github.com/microsoft/vscode/issues/139400
string match -q "$TERM_PROGRAM" "vscode"
and . (code --locate-shell-integration-path fish)

set CODE_VERSION (code --version | string split " " | tail -n2  | head -n1 )
echo "VS Code commit version: $CODE_VERSION"

# Temporary fix for VS Code setup breaking in fish
# if  string match -q "xcode or code-insiders not installed" $CODE_VERSION
if test -z $CODE_VERSION
  echo "Patching VS CODE PATHS for VS Code $CODE_VERSION"
  fish_add_path /vscode/bin/linux-x64/$CODE_VERSION/bin/
  fish_add_path /vscode/bin/linux-x64/$CODE_VERSION/bin/remote-cli/
  fish_add_path /vscode/bin/linux-x64/$CODE_VERSION/bin/helpers/
end

starship init fish | source