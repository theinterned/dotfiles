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

The tracked Copilot config runs `script/splunk-mcp`, which reads the token from
`op://Employee/Splunk token/password` and starts the MCP container against the
US East cluster.

Access requires a connected Tailscale client; see the `tailscale` skill when the
server fails to start.

## Authentication

The 1Password prompt appears once per Copilot session, not once per query: the
container stays alive for the whole session and reads the token only at startup.
Export `SPLUNK_BEARER_TOKEN` to skip the 1Password read, which is useful when
restarting the server repeatedly.

`current_user` reports that it cannot determine the username under bearer-token
auth. That is expected and does not indicate a broken connection.

## Searching

`search_splunk` takes `search_query`, not `query`. It prepends `search `, so the
SPL must not begin with a leading pipe. Always bound the window with
`earliest_time` / `latest_time`.

## Empty results are usually permissions

`list_indexes` returns every index *name* on the search head, including ones the
token cannot read. Querying an index the user has no role for returns
`total_event_count: 0` and an empty result set rather than an error, so an empty
response is not evidence that the data does not exist.

Access is granted per index through `splunk-index-*` roles. Check what the token
can actually read before concluding data is missing:

```sh
curl -sS -H "Authorization: Bearer $SPLUNK_BEARER_TOKEN" \
  'https://splunkazure-api-azure-eastus.octoca.ts.net/services/authentication/current-context?output_mode=json' \
  | jq -r '.entry[0].content.roles[]' | grep '^splunk-index-'
```

Broad indexes such as `main`, `_internal`, and `catchall` are typically *not*
granted, so prefer an index backed by a role the token holds. Request additional
access through a pull request to `github/entitlements`.
