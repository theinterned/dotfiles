---
name: splunk
description: >-
  Query GitHub's internal Splunk through the Splunk MCP server. Use when
  searching Splunk indexes, investigating logs, exceptions, or production
  telemetry, building SPL queries, or diagnosing why a Splunk search returns no
  results — e.g. "search Splunk for", "check prod-exceptions", "why is this
  Splunk query empty", "what indexes can I read".
---

# Splunk

The `splunk` MCP server registered by `script/register-mcp-servers` runs `script/splunk-mcp`,
which resolves `SPLUNK_BEARER_TOKEN` (env/keychain/1Password) and starts the MCP container
against the US East cluster.

Access requires a connected Tailscale client; see the `tailscale` skill when the
server fails to start.

## Authentication

The token is a 90 day JWT. `script/splunk-mcp` caches it in the macOS keychain
(`splunk-mcp-token`) and only falls back to `op read` when the cached copy is
missing or within a week of expiry, so 1Password prompts roughly once a quarter
rather than on every server start.

That caching matters because the prompt is **not** once per session. The wrapper
runs once per MCP server start, and a client that spawns a fresh server per tool
call triggers a fresh read each time. Export `SPLUNK_BEARER_TOKEN` to bypass both
layers; that is the path Codespaces uses, where the keychain does not exist.

To force a refresh after rotating the token in 1Password:

```sh
security delete-generic-password -s splunk-mcp-token -a "$USER"
```

`current_user` reports that it cannot determine the username under bearer-token
auth. That is expected and does not indicate a broken connection.

## Searching

`search_splunk` takes `search_query`, not `query`. It prepends `search `, so the
SPL must not begin with a leading pipe. Always bound the window with
`earliest_time` / `latest_time`.

Oneshot searches over busy indexes are slow. A 24 hour `stats count` on `rails`
exceeds two minutes and times out, so probe with a narrow window and `| head N`
before widening.

## Empty results

`list_indexes` returns every index *name* on the search head, including ones the
token cannot read. Querying an unreadable index returns `total_event_count: 0`
and an empty result set rather than an error, so an empty response distinguishes
nothing on its own: it means either no permission or no events in the window.

Access is **not** one `splunk-index-<name>` role per index. A broad role grants a
list of indexes through `srchIndexesAllowed`, so inspect that field rather than
matching role names:

```sh
curl -sS -H "Authorization: Bearer $SPLUNK_BEARER_TOKEN" \
  'https://splunkazure-api-azure-eastus.octoca.ts.net/services/authorization/roles?output_mode=json&count=0' \
  | jq -r '.entry[].content.srchIndexesAllowed[]?' | sort -u
```

Indexes are granted far more broadly than the role names suggest, so confirm
against that list before concluding an index is off limits. Some indexes exist in
both hyphen and underscore spellings (`rails-gitauth` and `rails_gitauth`) where
only one carries data, so check both before giving up. Request additional access
through a pull request to `github/entitlements`.
