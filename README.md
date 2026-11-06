# dotfiles

My dot files

## Setup

```sh
./script/setup
```

## npm shortcuts

Zsh/Bash aliases and Fish shortcuts use CFS for package installs and npx:

```sh
ni              # gh cfs -- npm install
ni <package>    # gh cfs -- npm install <package>
nci             # gh cfs -- npm ci
npx <tool>      # gh cfs -- npx <tool>
```

Setup installs Azure CLI and the `github/gh-cfs` GitHub CLI extension on macOS
and in Codespaces. Azure sign-in is a separate, manual step. If GitHub CLI or
CFS is unavailable, the shortcuts print setup instructions and stop rather
than downloading directly from npm.
Test and build shortcuts still use npm directly.
Open a new shell to load the updated shortcuts.
The `npx` alias preserves options and tool arguments without adding `--yes`.
In agent shells without aliases, use `gh cfs -- npx ...` directly.

### Codespaces

Dotfiles setup installs the tools without opening a browser or waiting for
authentication. In each Codespace, sign in with your `@githubazure.com` account:

```sh
az login --tenant 398a6654-997b-47e9-b12b-9515b896b4de --allow-no-subscriptions --use-device-code
gh cfs doctor --auth
```

Open the displayed URL in your browser and enter the device code when prompted.
Your laptop's Azure login is not shared with Codespaces. Then use `ni`, `nci`,
`npx`, or the explicit `gh cfs -- ...` form for package downloads.

For an existing Codespace, install the tools and reopen your shell:

```sh
brew install azure-cli gh
bash ~/.dotfiles/script/setup-cfs
```

Extension installation requires GitHub CLI access to `github/gh-cfs`. If it
fails, setup reports the error and stops; check the Codespace's repository
permissions before retrying. Setup never stores credentials in dotfiles or
starts package installs. Repository registry and lockfile migration is separate
from this workstation setup.

### MCP package launchers

MCP launchers do not load shell aliases. Playwright and Chrome DevTools are
registered through `script/register-mcp-servers` with `gh` as the executable
and `cfs`, `--`, `npx`, followed by the package arguments as separate arguments.
Do not set the executable to the string `gh cfs -- npx`.

For other npx-based servers, use the same structure:

```json
{
  "command": "gh",
  "args": ["cfs", "--", "npx", "-y", "<trusted-mcp-package>"]
}
```

Keep package arguments and environment settings unchanged. Complete Azure
sign-in manually before starting the servers, then restart the affected MCP
servers or agent session after changing their registration.

Fabric RTI uses `gh cfs -- uv tool run microsoft-fabric-rti-mcp` rather than
bare `uvx`, so Python dependency downloads also go through CFS. Its Kusto and
Fabric environment settings are unchanged. This launcher requires `uv` on PATH.

## Codespace window colors

In Codespaces, setup colors VS Code's title, status, and activity bars using one
of eight dark colors chosen from `CODESPACE_NAME`. The color stays the same
across restarts and rebuilds while the name and palette stay unchanged.
Different Codespaces can share a color. Local VS Code windows are unchanged.
GitHub links also use the default opener rather than an extension's opener.

To apply the settings in an existing Codespace, run:

```sh
bash ~/.dotfiles/script/apply-vscode-settings
```

The script merges `vscode/machine-settings.json` into
`data/Machine/settings.json` in both `~/.vscode-remote` and `~/.vscode-server`
when present, or creates the former if neither exists yet. Unrelated settings
are preserved; configured keys win. Existing files must be plain JSON (no
comments or trailing commas). Invalid files are reported and left untouched.
Applying settings requires `python3` and `CODESPACE_NAME`; outside Codespaces,
the script does nothing.

## Datadog CLI

The Homebrew bundles install Datadog's `pup` CLI as an alternative to Datadog
MCP. Install the official `dd-pup` skill separately for Copilot:

```sh
gh cfs -- npx skills add datadog-labs/agent-skills --skill dd-pup --agent github-copilot --global --full-depth -y
pup auth login --site datadoghq.com --read-only
pup auth status
```

Complete the browser sign-in for the intended Datadog organization. This login
is separate from MCP and Azure authentication; do not copy credentials between
them. Restart existing agent sessions to discover the new skill and instructions.
Use `pup --help` and command-specific help for the installed version.

Investigation commands should use `--read-only`. Only grant write permissions
when needed for a user-requested change. The existing Datadog MCP plugin is
left installed.

## Splunk MCP

The install scripts register a `splunk` MCP server that starts a Splunk MCP
container each time Copilot starts the MCP server, connected to the US East cluster. It reads the
token from the macOS keychain, falling back to
`op://Employee/Splunk token/password` locally, or from `SPLUNK_BEARER_TOKEN` in a
Codespace.

Splunk tokens are valid for 90 days, and 1Password prompts for biometric approval
on every read, so the wrapper caches the token in the keychain under
`splunk-mcp-token` and re-reads from 1Password only when the cached copy is
missing or within a week of expiry. Without that cache every MCP server start
triggers a prompt — and clients that spawn a server per tool call make that one
prompt per query. After rotating the token, clear the cache:

```sh
security delete-generic-password -s splunk-mcp-token -a "$USER"
```

`~/.copilot/mcp-config.json` is owned by Copilot itself — `copilot mcp add`, the
plugin installer and the `setup_*` tools all rewrite it — so it is deliberately
not tracked here. `script/register-mcp-servers` is the source of truth instead:
it declares every MCP server this machine should have and registers them through
`copilot mcp add`. The install scripts call it, and re-running it on its own is
safe and repairs the live config after anything rewrites it.

### Local macOS

1. Request the `splunk-capability-generate-tokens` entitlement and create an
   API token in [Splunk](https://splunk.githubapp.com).
2. Save it in 1Password as a Password item named `Splunk token` in the
   `Employee` vault.
3. Ensure Tailscale is running, then start a new `copilot` session. The wrapper
   starts Docker Desktop automatically if it is not already running. The first
   image pull requires access to `ghcr.io/github/splunk-mcp-server`.

If Docker cannot pull the image, authorize it with GitHub Packages:

```sh
gh auth refresh -s read:packages
# GH_TOKEN, when set, shadows the refreshed keyring credential and will not
# carry read:packages, which surfaces as a 403 on pull.
env -u GH_TOKEN gh auth token | docker login ghcr.io -u "$(gh api user --jq .login)" --password-stdin
docker pull ghcr.io/github/splunk-mcp-server:latest
```

To use another regional cluster, export `SPLUNK_HOST` with that region's
Tailscale hostname and a token issued by that region.

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

Set a `SPLUNK_BEARER_TOKEN` [Codespaces secret](https://docs.github.com/codespaces/managing-your-codespaces/managing-your-account-specific-secrets-for-github-codespaces).
After each Codespace start, connect Tailscale before starting Copilot:

```sh
sudo tailscale up --hostname "$CODESPACE_NAME" --accept-routes --report-posture
```

The MCP wrapper detects Codespaces and configures Docker to use Tailscale DNS.
Use `/mcp` to confirm the server is connected. Under bearer-token
authentication, `current_user` may be unavailable; run an ordinary search
instead to verify access.

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
