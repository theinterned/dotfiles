# dotfiles

My dot files

## Setup

```sh
./script/setup
```

## Working in a worktree (edit isolated, run live)

Every dotfile in `$HOME` is symlinked through a single indirection symlink,
`~/.dotfiles`, which normally points at this main checkout. Because the whole
live environment resolves through that one pointer, you can develop a change in
an isolated git worktree and have it run live on this machine by flipping
`~/.dotfiles` at the worktree — then flip back when you're done.

```sh
# from anywhere in the repo (or a worktree of it):
script/use-checkout /path/to/worktree   # live env now tracks the worktree
script/use-checkout --status            # show where ~/.dotfiles points
script/use-checkout --reset             # back to the main checkout
```

Open a new shell (`exec $SHELL -l`) to reload shell/git config; Copilot skills
and other read-at-use configs pick up the change immediately. Only worktrees of
this repo are accepted. Re-run `script/link-dotfiles` after adding a new tracked
dotfile so it gets routed through `~/.dotfiles` too.

## Update `Brewfile`

```sh
brew bundle dump --describe --force
```

## Some helpful reading

- <https://dotfiles.github.io>
- [Gist: Brew Bundle Brewfile Tips](https://gist.github.com/ChristopherA/a579274536aab36ea9966f301ff14f3f)
- <https://github.com/skalnik/dotfiles>
- <https://github.com/manuelpuyol/dotfiles>
- <https://github.com/keithamus/dotfiles>
- <https://github.com/Homebrew/homebrew-cask-fonts>
