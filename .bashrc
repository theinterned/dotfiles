# Go: add GOPATH/bin to PATH
if command -v go &>/dev/null; then
  export PATH="$(go env GOPATH)/bin:$PATH"
fi
