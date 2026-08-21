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

On a local machine, ensure the Tailscale desktop client is installed, running,
and signed in. If the client reports that it is disconnected, run:

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

The Splunk launcher requires both Docker and a connected Tailscale client. In
Codespaces it configures Docker to use the Tailscale DNS resolver. If the
launcher reports a Tailscale failure, restore connectivity first, then restart
the Copilot session so the MCP server launches again.
