---
name: tailscale
description: >-
  Check, connect, and troubleshoot the Tailscale client used to reach GitHub
  internal services over the tailnet. Use when a tailnet-only host will not
  resolve, when Tailscale needs installing or reconnecting, or before accessing
  internal services such as the Splunk MCP server — e.g. "is Tailscale
  connected", "install Tailscale", "host won't resolve", "tailscale up".
---

# Tailscale

Use this skill before accessing internal services that depend on the GitHub
tailnet, including the Splunk MCP server.

## Safety

- Never request, print, store, or paste Tailscale auth keys in chat, source
  code, shell history, or logs.
- Do not run `tailscale logout`, modify ACLs, change DNS settings, or remove
  devices without the user's explicit confirmation.
- Report a disconnected client clearly instead of assuming internal hosts are
  reachable.

## Check connectivity

Run these commands before using a tailnet-only service:

```sh
tailscale status --json | jq -r '.BackendState'
tailscale netcheck
```

`Running` confirms the local Tailscale client is connected. On macOS, the
`tailscale` alias invokes the CLI bundled with the Tailscale app.

## Connect

On a managed macOS machine, install Tailscale from Jamf Self Service rather
than Homebrew, so the MDM-managed copy stays authoritative:

```sh
open -a 'Self Service'
```

Once installed, ensure the client is running and signed in. If it reports that
it is disconnected, run:

```sh
tailscale up
```

In a Codespace, the target repository's devcontainer must include the
`ghcr.io/tailscale/codespace/tailscale` feature and expose `/dev/net/tun`.
After every Codespace start, connect with:

```sh
sudo tailscale up --hostname "$CODESPACE_NAME" --accept-routes --report-posture
```

## Splunk MCP

The Splunk launcher requires both Docker and a connected Tailscale client. It
starts Docker Desktop on its own when needed, but it cannot install or sign in
to Tailscale. In Codespaces it configures Docker to use the Tailscale DNS
resolver. If the launcher reports a Tailscale failure, restore connectivity
first, then restart the Copilot session so the MCP server launches again.

A connected client does not by itself guarantee the Splunk hosts are
reachable: access to `splunkazure-api-*.octoca.ts.net` is granted separately
through tailnet ACLs alongside the Splunk entitlement. If `tailscale status`
reports `Running` but the host does not resolve, the ACL is the likely cause.

See the `splunk` skill for querying the MCP server itself.

