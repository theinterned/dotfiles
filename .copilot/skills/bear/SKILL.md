---
name: bear
description: >-
  Read from and write to the user's Bear notes (Bear.app on macOS) via the
  bundled `bearcli` binary. Use whenever the user wants to search, read, list,
  create, append/prepend, edit, tag, pin, archive, or otherwise work with their
  Bear notes from an agent — e.g. "search my Bear notes", "what's in my Bear note
  about X", "add this to Bear", "create a Bear note", "append to my … note in
  Bear", "tag/pin/archive a Bear note". Bear is a local macOS notes app; there is
  no web API — all access goes through the local `bearcli`.
---

# Bear notes via `bearcli`

Bear ships a command-line interface, `bearcli`, that is the way to read and write
Bear notes from a terminal agent. Prefer it over any Bear MCP server — it needs no
configuration and Bear's own FAQ recommends it for CLI/terminal use.

## The binary

`bearcli` is bundled inside the app and is **not on `PATH`**. Call it by full path
(macOS default install):

```bash
BC=/Applications/Bear.app/Contents/MacOS/bearcli
"$BC" --help          # top-level help + subcommand list
"$BC" "<subcommand>" --help    # detailed help for any subcommand
```

Requires **Bear 2.8+**. If the binary isn't there, check for a non-default app
location (`mdfind -name bearcli` or `mdfind "kMDItemKind == 'Application'" | grep -i bear`)
and tell the user if Bear isn't installed / is too old rather than guessing.

**Self-documenting:** the CLI is fully described by its own help. When unsure of a
flag, run `"$BC" <sub> --help` (or `"$BC" help all`) instead of assuming.

## Subcommands (surface)

Reads:
- `search [query]` — Bear search syntax (`#tag`, `!#tag` exact, `#*/sub`,
  `@today`, `@lastNdays`, `@date(YYYY-MM-DD)`, `@title`, `@tagged`, `"exact"`,
  `-negation`, …). `--sort`, `--limit`, `--offset`, `--location notes|trash|archive|all`,
  `--count`.
- `list` — list notes without a query (e.g. `--tag`).
- `show` — structured note fields (id, title, tags, hash, length, dates, …).
  Content is excluded unless you pass `--fields all,content`.
- `cat` — raw note content (Markdown). `--offset`/`--limit` for byte slicing.
- `search-in` — find exact string occurrences within a single note.

Mutations:
- `create` — new note (returns the new note id — capture it).
- `append` — add content; `--position beginning|end`. **`beginning` = prepend**
  (inserts after the title and any top-placed tags); `end` is the default.
- `edit` — find exact text and `--replace` / `--insert-after` / `--insert-before`;
  `--all`, `--ignore-case`, `--word`. Repeat `--find` for batch edits.
- `overwrite` — replace a note's entire content (optional `--base <hash>` for
  optimistic-concurrency; without it the CLI write is unconditional).
- `tags`, `pin`, `trash`, `archive`, `restore`, `attachments`, `open`.
- `mcp-server` — stdio MCP transport (only if you specifically need MCP; not needed
  for CLI use).

## Working rules (important)

- **Identify notes by `id`, not title, for writes.** Titles collide and change.
  `search`/`show` with `--format json --fields id,title` to resolve the id first,
  and **confirm the target with the user** before any mutation.
- **Mutations are silent on success — the exit code is the only signal.** Do not
  treat "no output" as failure; do treat a nonzero exit as failure. `--format json`
  applies to *reads* only.
- **Pipe body content via stdin to avoid escaping bugs.** `create`/`append`/
  `edit`/`overwrite` accept `--content`/text args that interpret `\n \t \r \\`,
  but **stdin is NOT unescaped** — so piping literal Markdown is safest:
  `printf '%s' "$body" | "$BC" append "<note-id>" --position beginning`.
- **Back up before destructive writes.** Before `overwrite` (or a large `edit`),
  dump the current note so a bad write is recoverable:
  `"$BC" cat "<note-id>" > "/tmp/bear-backup-$(date +%Y%m%d-%H%M%S).md"`.
- **Attachments are protected.** Edits that would drop attachments are rejected
  unless re-run with `--force`; read the rejection before forcing.
- **Preserve tags.** Bear derives tags from `#hashtags` in the body and title from
  the first heading — when using `overwrite`, keep the existing tag line / title
  intact unless the user asked to change them.
- **Read-only by default.** Prefer `search`/`cat`/`show` to answer questions; only
  create/edit/overwrite when the user asks to change a note, and show a draft first.

## Related skill

For the specific weekly-work-journal workflow (priming this week's diary entry from
the status updates), use the **weekly-reflection** skill, which builds on this
one.
