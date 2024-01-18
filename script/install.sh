echo
echo
echo "##################################################"
echo "####### Install ###########################"
echo "##################################################"
echo
echo

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

[ $(uname -s) = "Darwin" ] && export MACOS=1 && export UNIX=1
[ $(uname -s) = "Linux" ] && export LINUX=1 && export UNIX=1

echo "MACOS: $MACOS"
echo "LINUX: $LINUX"

echo
echo "🍺 Install homebrew"
echo

which brew > /dev/null
if [ "$?" != "0" ]
then
  echo
  echo "⬇️ Installing Homebrew"
  echo
  
  if [ "$CODESPACES" = "true" ]
  then
    # don't fully clone homebrew on codespaces
    export HOMEBREW_INSTALL_FROM_API=true
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/vscode/.bashrc
    (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/vscode/.zshrc
    (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/vscode/.config/fish/conf.d/homebrew.fish
  else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
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

if [ $MACOS ]
then
  $SCRIPTPATH/install-mac.sh
elif [ $LINUX ]
then
  $SCRIPTPATH/install-linux.sh
fi

npm i -g @koddsson/coworking-with