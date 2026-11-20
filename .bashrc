# Go: add GOPATH/bin to PATH
if command -v go &>/dev/null; then
  export PATH="$(go env GOPATH)/bin:$PATH"
fi

if [[ $- == *i* && -f "$HOME/.aliases" ]]; then
  source "$HOME/.aliases"
fi
