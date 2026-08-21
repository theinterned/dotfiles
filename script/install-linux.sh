#!/bin/bash
echo
echo
echo "###########################"
echo "####### Linux Setup #######"
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
  
  # don't fully clone homebrew on codespaces
  export HOMEBREW_INSTALL_FROM_API=true
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
  (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> $HOME/.bashrc
  (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> $HOME/.zshrc
  mkdir -p $HOME/.config/fish/conf.d
  touch $HOME/.config/fish/conf.d/homebrew.fish
  (echo; echo 'eval (/home/linuxbrew/.linuxbrew/bin/brew shellenv)') >> $HOME/.config/fish/conf.d/homebrew.fish
else
  echo "✅ Homebrew already installed"
fi

echo
echo "🍻 Running brew bundle"
echo

brew bundle --file=$HOME/Brewfile.codespaces

echo 
echo "✅ Homebrew bundle complete"
echo

echo
echo "✅ Linux setup complete"
echo

echo
echo "🔗 Registering Copilot CLI MCP servers"
echo

# ~/.copilot/mcp-config.json is owned by Copilot itself (see install-mac.sh for
# the full rationale), so register through the supported writer rather than
# symlinking a tracked copy over it.
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

echo
echo "🔗 Linking Copilot CLI custom instructions"
echo

ln -sfv "$HOME/.dotfiles/.copilot/copilot-instructions.md" "$HOME/.copilot/copilot-instructions.md"

echo
echo "✅ Copilot CLI custom instructions linked"
echo

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

echo
echo "🔑 Configuring git credential helpers"
echo

# Use the GitHub CLI as the credential helper for github.com so auth stays
# in sync with `gh` and works the same way across machines (incl. Codespaces).
# The empty value first clears any inherited helpers for this host.
git config -f "$HOME/.gitconfig-local" credential.https://github.com.helper ""
git config -f "$HOME/.gitconfig-local" --add credential.https://github.com.helper "!gh auth git-credential"

echo
echo "✅ Git credential helpers configured"
echo