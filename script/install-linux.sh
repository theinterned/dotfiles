packages=(
    fish
    git
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
  for package in "${packages[@]}"
  do
    apt install -y $package
  done

end

# nvm
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# starship
FORCE=1 sh -c "$(curl -fsSL https://starship.rs/install.sh)"