#!/bin/bash
echo
echo
echo "###########################"
echo "####### MacOS Setup #######"
echo "###########################"
echo
echo

echo
echo "🍺 Install homebrew"
echo

which brew > /dev/null
if [ "$?" != "0" ]
then
  echo
  echo "⬇️ Installing Homebrew"
  echo

  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "✅ Homebrew already installed"
fi

echo
echo "🍻 Running brew bundle"
echo

brew bundle --file=$HOME/Brewfile

echo 
echo "✅ Homebrew bundle complete"
echo

# Specify the preferences directory
defaults write com.googlecode.iterm2.plist PrefsCustomFolder -string "$HOME/.dotfiles/iterm/"
# Tell iTerm2 to use the custom preferences in the directory
defaults write com.googlecode.iterm2.plist LoadPrefsFromCustomFolder -bool true
# Show cmd+tab app switcher on all monitors
defaults write com.apple.Dock appswitcher-all-displays -bool true
# restart the Dock to apply changes
killall Dock

echo
echo "✅ MacOS setup complete"
echo

echo
echo "🔗 Registering Copilot CLI MCP servers"
echo

# ~/.copilot/mcp-config.json is owned by Copilot itself: `copilot mcp add`, the
# plugin installer and the various `setup_*` tools all rewrite it. Symlinking it
# to this repo loses either way -- the file gets replaced (silently detaching the
# tracked copy) or written through (committing machine-specific absolute paths).
# So register the servers we care about through the supported writer instead.
mkdir -p "$HOME/.copilot"

if command -v copilot >/dev/null 2>&1; then
  # `copilot mcp add` refuses to overwrite, so drop any existing entry first.
  copilot mcp remove splunk >/dev/null 2>&1 || true
  copilot mcp add splunk \
    --env 'SPLUNK_BEARER_TOKEN=${SPLUNK_BEARER_TOKEN}' \
    -- bash -lc 'exec "$HOME/.dotfiles/script/splunk-mcp"'
else
  echo "⚠️  copilot CLI not found; skipping MCP server registration"
fi

echo
echo "✅ Copilot CLI MCP servers registered"

echo
echo "🔗 Linking Copilot CLI custom instructions"
echo

ln -sfv "$HOME/.dotfiles/.copilot/copilot-instructions.md" "$HOME/.copilot/copilot-instructions.md"

echo
echo "✅ Copilot CLI custom instructions linked"

echo
echo "🔗 Linking Copilot CLI skills"
echo

mkdir -p "$HOME/.copilot/skills"
skills_dir="$HOME/.dotfiles/.copilot/skills"
if [ -d "$skills_dir" ]; then
  shopt -s nullglob
  for skill in "$skills_dir"/*/; do
    ln -sfn "${skill%/}" "$HOME/.copilot/skills/$(basename "${skill%/}")"
  done
  shopt -u nullglob
fi

echo
echo "✅ Copilot CLI skills linked"

echo
echo "🔑 Configuring git credential helpers"
echo

# Keep osxkeychain as the general (host-agnostic) fallback helper
git config -f "$HOME/.gitconfig-local" credential.helper osxkeychain

# Use the GitHub CLI as the credential helper for github.com so auth stays
# in sync with `gh` and works the same way across machines.
# The empty value first clears any inherited helpers for this host.
git config -f "$HOME/.gitconfig-local" credential.https://github.com.helper ""
git config -f "$HOME/.gitconfig-local" --add credential.https://github.com.helper "!gh auth git-credential"

echo
echo "✅ Git credential helpers configured"