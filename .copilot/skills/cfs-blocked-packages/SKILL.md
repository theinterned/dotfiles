---
name: cfs-blocked-packages
description: >-
  Diagnose and fix packages that Central Feed Services (CFS) blocks or holds
  back, and find programs that pull from public registries without CFS. Use
  when a CFS install fails with a missing version (npm ETARGET or E404, pnpm
  ERR_PNPM_NO_MATCHING_VERSION or ERR_PNPM_FETCH_404, pip "No matching
  distribution found", uv "there is no version of"), when a Dependabot or
  security update needs a version the feed does not have yet, or when Microsoft
  Defender shows "Content is blocked" for registry.npmjs.org,
  registry.yarnpkg.com, pypi.org, or files.pythonhosted.org — e.g. "CFS is
  blocking this package", "version not found in the feed", "Defender keeps
  blocking npm".
---

# CFS blocked packages

Source: https://github.com/github/cfs-at-github/blob/main/docs/blocked-package-pulls.md

CFS (Central Feed Services) is GitHub's internal package mirror. It scans
packages and holds each newly published version for **seven days** before the
feed lists it. Public registries are blocked on managed laptops.

## Safety

- Never bypass CFS: do not switch to a public registry, change registry
  settings, disable security checks, or remove lockfiles or integrity hashes.
- Connecting to the Microsoft VPN does not unblock public registries.
- Keep Defender archives, logs, and command output local. They can contain
  device details, paths, arguments, or secrets.
- Do not open issues or post in Slack for the user without confirmation.

First decide which case applies:

- A CFS command failed with a missing version → [Held version](#held-version).
- Defender raised a "Content is blocked" alert → [Defender alerts](#defender-alerts).
- An auth or setup error, not a missing version → run `gh cfs doctor --auth`
  and follow the CFS setup notes in the personal Copilot instructions. Do not
  treat auth failures as held versions, or the reverse.

## Held version

A pull fails when it needs a version still in the hold: a lockfile or exact
pin, a dependency that pins one, or a range only the new version satisfies (for
example `^3.0.0` when 3.0.0 is the only 3.x release). If every version is held,
the whole package returns 404. Typical errors:

- npm: `ETARGET` (`No matching version found for <package>@<version>`) or `E404`
- pnpm: `ERR_PNPM_NO_MATCHING_VERSION` or `ERR_PNPM_FETCH_404`
- pip: `No matching distribution found`
- uv: `there is no version of <package>==<version>`

### Diagnose

1. Find the package and version from the error. For a transitive dependency,
   find what requires it (for example `npm ls <package>` or the lockfile).
2. List the versions the feed has:

   ```sh
   gh cfs -- npm view <package> versions --json
   gh cfs -- pip index versions <package>
   ```

   If the needed version is missing from the list, it is most likely held.
3. Optionally confirm the version is new by checking its publish date in the
   package's GitHub releases or changelog. Do not query the public registry.

### Fix

Pick one and tell the user which:

- **Use a listed version.** Pin or downgrade to the newest version the feed
  lists, then reinstall through `gh cfs`. For a transitive dependency, adjust
  the parent dependency or use `overrides` (npm) or `resolutions` (Yarn).
- **Wait for the hold to end.** A few packages appear sooner, but plan on seven
  days from publication. For a Dependabot pull request, rerun CI after the hold
  ends. Repositories not
  [enrolled in CFS routing](https://github.com/github/cfs-at-github/blob/main/docs/dependabot-findings.md#enroll-a-repository)
  can get Dependabot pull requests for held versions; security updates skip
  Dependabot's cooldown and hit this most often.
- **Request an urgent release.** Only for a security fix, or a new release of a
  public package the user's team publishes, that cannot wait. Draft an issue
  for https://github.com/github/cfs-at-github/issues/new with the package,
  version, why it cannot wait, and a link to the security alert if there is
  one. Urgent requests can also go to the `#vuln-management` Slack channel.
  Feed owners can release a specific npm version from quarantine; that release
  does not cover its dependencies or future versions.

Private packages from GitHub Package Registry or Octofactory do not go through
CFS yet, so the hold does not apply to them. Keep pulling them from their
current source.

## Defender alerts

A "Content is blocked" alert for a public registry means something tried to
pull a package without CFS. The alert does not name the program.

Common sources:

- **MCP servers started with `npx`, `uvx`, `pnpm dlx`, or `bunx`.** Clients
  restart failing servers, so one server can alert every minute.
- **Copilot app setup scripts.** `.github/github-app.yml` can run a script such
  as `script/bootstrap` on every session start. If it installs packages
  without CFS, the repository needs to
  [migrate to CFS](https://github.com/github/cfs-at-github#migrate-your-repository).
- **npm's update check**, even for `npm run` and `npm test`. Disable it with
  `npm config set update-notifier false`.
- **VS Code's npm extension** looking up `package.json` dependencies. Disable
  it with `"npm.fetchOnlinePackageInfo": false`.
- **Package manager commands run without `gh cfs`**, including scripts and
  tools that run one for you.

### Find what's pulling

1. List running package runners (npx shows up as `npm exec`), then look up each
   parent PID to see which app started it:

   ```sh
   ps -axo pid=,ppid=,command= | grep -E '[n]pm exec|[u]vx|[u]v tool run|[p]npm dlx|[b]unx|[b]un x '
   ps -o pid=,ppid=,command= -p <parent_pid>
   ```

2. From the repository root, search MCP configs for package runners:

   ```sh
   grep -rnE --include=mcp-config.json --include=mcp.json --include=.mcp.json \
     '"(npx|uvx|bunx|pnpx)"|dlx' \
     ~/.copilot/mcp-config.json ~/.copilot/installed-plugins \
     "$HOME/Library/Application Support/Code/User/mcp.json" .vscode 2>/dev/null
   ```

   In these dotfiles, `script/register-mcp-servers` registers MCP servers. Fix
   servers there rather than editing `~/.copilot/mcp-config.json` directly.

3. Check recent npm debug logs and compare their UTC timestamps with the alert:

   ```sh
   grep -HE 'verbose (cli|title|argv|cwd)|http fetch|ENOTCONN' \
     ~/.npm/_logs/*debug*.log 2>/dev/null | tail -n 100
   ```

4. If still unknown, ask the user to stop MCP servers or quit apps one at a time
   until the alerts stop.

5. Last resort: a Defender diagnostic archive needs `sudo`, so ask the user to
   run it soon after an alert:

   ```sh
   sudo mdatp diagnostic create
   logs=$(mktemp -d)
   sudo unzip -q "/path/from-command.zip" \
     '*microsoft_defender_core.log*' '*network_protection*.log*' -d "$logs"
   find "$logs" -type f -name '*microsoft_defender_core.log*' -exec zgrep -hE \
     'uri=https://(registry\.(npmjs\.org|yarnpkg\.com)|pypi\.org|files\.pythonhosted\.org)' {} +
   ```

   Use a `netext blocked connection` record from the core log; do not rely on
   `enforcement="block"`, which also appears on allowed connections. Match its
   remote endpoint and timestamp, to the millisecond, with a socket flow in the
   network log; that flow has the PID. Both logs use UTC, while the alert shows
   local time. The bracketed number at the start of a line is Defender's own
   process, not the offender. Trace the PID promptly, since logs rotate and
   PIDs get reused:

   ```sh
   ps -o pid=,ppid=,command= -p <pid>
   lsof -a -p <pid> -d cwd -Fn
   ```

   Repeat with each parent PID.

### Fix MCP servers

Install the server once through CFS and point the client at the installed
program. Nothing downloads at startup, and the server never gets CFS
credentials. For example:

```sh
gh cfs -- uv tool install pagerduty-mcp   # installs ~/.local/bin/pagerduty-mcp
```

See the gh-cfs [npx](https://github.com/github/gh-cfs/blob/main/docs/reference/npx.md#mcp-servers)
and [uv](https://github.com/github/gh-cfs/blob/main/docs/reference/uv.md#tools-and-mcp-servers)
references for per-runner config. If alerts continue, search again; another
tool is still pulling.
