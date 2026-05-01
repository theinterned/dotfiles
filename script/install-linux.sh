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
echo "🔗 Linking Copilot CLI MCP config"
echo

mkdir -p "$HOME/.copilot"
ln -sfv "$HOME/.dotfiles/.copilot/mcp-config.json" "$HOME/.copilot/mcp-config.json"

echo
echo "✅ Copilot CLI MCP config linked"
echo