echo
echo
echo "##################################################"
echo "####### Linux: Installing packages ###############"
echo "##################################################"
echo
echo

packages=(
  fish
  git
  git-delta
  ack
  bat
  rbenv
  direnv
  gh
  jq
)
  # Arch
if command -v pacman &> /dev/null
then
  echo 
  echo "🙌 Installing packages via YaY"
  echo

  packages+=(nvm otf-hasklig starship)
  pacman -S git base-devel

  # Install YaY
  git clone https://aur.archlinux.org/yay.git
  cd yay
  makepkg -si
  cd ..
  rm -rf yay

  for package in "${packages[@]}"
  do
    yay -Sy $package
  done
elif command -v apt &> /dev/null
then
  echo 
  echo "📦 Installing packages via apt"
  echo

  for package in "${packages[@]}"
  do
    apt install -y $package
  done
fi

echo 
echo "🖖 Installing nvm"
echo

# nvm
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

echo 
echo "🚀 Installing Starship"
echo

# starship
FORCE=1 sh -c "$(curl -fsSL https://starship.rs/install.sh)"