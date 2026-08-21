# dotfiles

My dot files

## Setup

```sh
./script/setup
```

## Splunk MCP

The tracked Copilot configuration starts a Splunk MCP container per Copilot
session. It reads the US East token from `op://Employee/Splunk token/password`
locally, or accepts Codespaces secrets for any supported region.

### Local macOS

1. Request the `splunk-capability-generate-tokens` entitlement and create an
   API token in [Splunk](https://splunk.githubapp.com).
2. Run `script/store-splunk-token`, then paste the token without echoing it.
3. Ensure Docker Desktop and Tailscale are running, then start a new `copilot`
   session. The first image pull requires access to
   `ghcr.io/github/splunk-mcp-server`.

If Docker cannot pull the image, authorize it with GitHub Packages:

```sh
gh auth refresh -s read:packages
gh auth token | docker login ghcr.io -u "$(gh api user --jq .login)" --password-stdin
docker pull ghcr.io/github/splunk-mcp-server:latest
```

The default profile is `dotcom` (US East). To enable another region, export its
matching token before launching Copilot: `SPLUNK_TOKEN_EU`,
`SPLUNK_TOKEN_AE`, `SPLUNK_TOKEN_CUS`, or `SPLUNK_TOKEN_JPW`. The MCP server
adds only profiles with a token and each profile uses port 443.

### Codespaces

The target repository's `.devcontainer/devcontainer.json` must enable
Tailscale and expose the TUN device before the Codespace is created:

```jsonc
{
  "features": {
    "ghcr.io/tailscale/codespace/tailscale": {
      "version": "latest"
    }
  },
  "runArgs": [
    "--device=/dev/net/tun"
  ]
}
```

Set a `SPLUNK_TOKEN_DOTCOM` [Codespaces secret](https://docs.github.com/codespaces/managing-your-codespaces/managing-your-account-specific-secrets-for-github-codespaces)
and add regional token variables only when needed. After each Codespace start,
connect Tailscale before starting Copilot:

```sh
sudo tailscale up --hostname "$CODESPACE_NAME" --accept-routes --report-posture
```

The MCP wrapper detects Codespaces and configures Docker to use Tailscale DNS.
Use `/mcp` to confirm the server is connected, then use `list_profiles` to
confirm available regions. Under bearer-token authentication, `current_user`
may be unavailable; run an ordinary search instead to verify access.

The included `tailscale` skill checks connectivity before internal-service work
and documents the safe local and Codespaces connection commands.

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
