---
name: weekly-reflection
description: >-
  Prime this week's entry in the Bear "Weekly Work Diary" note from the weekly
  status updates. Use when the user says "prime my weekly journal", "update my
  work diary", "add this week's status to my Bear journal", "start this week's
  diary entry", or after posting the weekly GitHub status updates and wanting
  them copied into the Bear work journal. Fills a fixed template (Goal Progress,
  Work done, optional Wins/Fails/Kudos/Decisions/Ideas), formats each status
  update under a linked h3, and prepends the finished block to the top of the
  ongoing diary note.
---

# Prime the weekly Bear work-journal entry

Build this week's entry from the fixed template + the weekly status update(s) and
**prepend** it to the top of the ongoing Bear "Weekly Work Diary" note (newest
week first).

## Why this journal exists

Two purposes — keep the entry useful for both:

1. **Continuous self-improvement.** An honest weekly reflection on how the week
   went (hence the Wins / Fails / Goal Progress sections).
2. **Evidence for company self-reflections.** It's the body of evidence drawn on
   for the formal half-year self-reflection (kept in the `theinterned/reflections`
   repo). Concrete, linkable, attributable entries matter.

Per the note's own convention, mark work the user is **directly responsible for**
with a `⭐`.

## Tooling

- **Bear:** driven through the bundled `bearcli` binary
  (`/Applications/Bear.app/Contents/MacOS/bearcli`, Bear 2.8+, not on `PATH`). See
  the **`bear`** skill for the full command surface and working rules (identify by
  id, mutations are silent-on-success, pipe body via stdin, back up before
  overwrite). This skill assumes those rules.
- **GitHub:** `gh` for fetching the status-update comment bodies and issue titles.

## Locate the diary note (do NOT hardcode the id)

The note rotates each half-year (e.g. `FY27 H1` → `FY27 H2`), so find the current
one and **confirm with the user before writing**:

```bash
BC=/Applications/Bear.app/Contents/MacOS/bearcli
"$BC" search "Weekly Work Diary" --sort created:desc --format json --fields id,title,modified
```

Pick the newest note whose title **starts with** `Weekly Work Diary` (ignore the
`... Self Reflection ...` notes). Capture its `id`.

### Note structure (match it exactly)

```
# Weekly Work Diary FY27 H1 • <date range>      <- title (h1)
#work/github #work/github/reflektive #.diary/work#   <- tag line
<blank>
⭐ *Note for epic and batch updates ...*         <- standing note line
<blank>
# 2026-07-10                                     <- most recent week (h1)
...week block...
---                                              <- each week block ends with ---
# 2026-07-03
...
---
```

The stable header (title + tag line + `⭐` note line) stays at the top. Week blocks
follow, **newest first**, each ending with `---`. The new entry is inserted
**immediately before the first `# YYYY-MM-DD` heading**.

### Conventions

- **⭐ ownership marker.** Prefix work the user is **directly responsible for** with
  a `⭐` (per the note's own standing convention).
- **People tags.** Bear uses `#hashtags` for tags, and the user tags people by their
  handle nested under a `#@` parent tag: handle `@theinterned` is written
  `#@/theinterned`, `@alidusha` is `#@/alidusha`, etc. This groups every person under
  the `#@` tag. **Always write people mentions in this `#@/<handle>` form** (not a
  bare `@handle` or a GitHub link) so they register as Bear tags — most useful in
  Kudos, but applies anywhere a person is named.

## Build the entry

Start from `references/template.md`. Replace `{{DATE}}` with **today's date**
(`YYYY-MM-DD`, from the environment's current datetime).

### First-responder (FR) weeks

If the user was on first-responder rotation, insert this line right after the
`# <date>` heading and before `## 🥅 Goal Progress` (add any noteworthy FR notes
under it):

```
## 🚨 I’m FR this week so expect lighter progress …
```

Otherwise omit it.

### 🥅 Goal Progress (always filled)

Fill a sub-bullet under **each** goal. First read the status update(s) and draft a
candidate line for any goal the week's work speaks to. Then **interview the user
one item at a time** (see *Interview format* below) — one goal per question,
proposing your candidate line where you have one and flagging its strength. Typical
mappings for this initiative:

- **Goal 1 (TT violations → zero):** the sanitization / DOMPurify / preset / spike work.
- **Goal 3 (communicate more broadly):** decision-log entries, ADRs, Core UX discussions.

If a goal genuinely had no movement, `No progress` is a fine answer — don't invent one.

#### Interview format (Goal Progress *and* the five optional sections)

Ask about **one item at a time** — never batch several goals or sections into a
single question, and never present the whole draft as one big confirm/edit gate.
For each item, in order:

1. Ask a focused, single question scoped to that one item (one goal, or one of
   Wins / Fails / Kudos / Decisions / Ideas).
2. **Propose candidate content when you have it** — surface the line you drafted
   (for goals) or the candidate you spotted in the week's work (for sections), so
   the user is reacting to something concrete rather than a blank prompt. Note when
   a candidate is strong vs. light/speculative.
3. Let the user confirm, edit, replace, or skip it, then move to the next item.

Use the `ask_user` tool for each question. This one-at-a-time rhythm applies to all
four goals and all five optional sections.

### 🏗️ Work done (all updates written this week)

Include **every** status update the user wrote this week (e.g. the epic-level
update *and* the executive rollup), each as its own block.

**First, locate this week's updates** (resolution order — this skill is pinned to
this Mac by Bear, but the status updates may have been written on another machine,
so degrade gracefully):

1. **Handoff manifest** — if `~/.copilot/state/weekly-status/latest.json` exists
   *and* its `week_start` is the current week, use its `updates[]` (each has
   `repo`, `issue`, `title`, `comment_url`). This is written best-effort by the
   `weekly-status-update` skill at the end of a run; **it may be absent** (first
   run, or the update was posted on another machine) — that's expected, just fall
   through.
2. **Local artifacts** — otherwise, if you're in the same session/machine where the
   updates were drafted, the sanitized `*.post.md` files in the status-update
   session's `files/` dir are equivalent source.
3. **Ask the user** — otherwise, ask them to paste the comment URL(s) for the
   update(s) they posted this week. Never guess or invent them.

Then, for each update:

1. **Fetch the posted body and issue title** from the comment URL
   (`https://github.com/<owner>/<repo>/issues/<n>#issuecomment-<id>`):

   ```bash
   gh api repos/<owner>/<repo>/issues/comments/<id> -q .body   # markdown body
   gh issue view <n> --repo <owner>/<repo> --json title -q .title
   ```

   (If using a local `*.post.md` artifact from step 2, that body is equivalent.)
2. **h3 title line**, mirroring the note's established style — the GitHub page
   title, linked to the comment:

   ```
   ### [<issue title> · Issue #<n> · github/<repo>](<comment-url>)
   ```
3. **Clean the body:** strip every `<!-- data ... -->` Howie marker line (and the
   blank lines they leave), then **demote ATX headings so they are strictly below
   the h3 title line** (minimum `####`, e.g. `##` → `####`, `###` → `####`, `####` → `#####`).
4. Order the blocks epic-level update(s) first, then the rollup (the user can
   reorder on review).


Also leave room for **work that happened outside the status updates** — ask the
user if anything should be added manually, and mark ⭐ items they own.

### 🏆 Wins / 💩 Fails / 🙏 Kudos / 🌳 Decisions / 🔮 Ideas (optional content — but always ask)

These are the heart of the reflection, not an afterthought. **You MUST walk the
user through all five, one at a time** — even the ones you think are empty —
following the *Interview format* above (one focused `ask_user` question per
section, proposing any candidate you spotted before letting the user add, edit, or
skip it). **Never silently omit a section** because you found no candidate — ask
first. Only *after* the user has decided on each, **delete the headings for the
ones left empty** (don't leave an empty heading).

## Review, back up, then prepend

**1. Draft and confirm.** First make sure you've already **prompted goal by goal
and walked the user through all five optional sections** — don't assemble the
final block until both are done. Then write the assembled week block to a local
draft file and **show it to the user for confirmation.** Never write to Bear
before they approve.

**2. Back up first.** Dump the whole current note to a timestamped file so a bad
write is always recoverable (`NOTE_ID` = the diary note id you resolved above):

```bash
BC=/Applications/Bear.app/Contents/MacOS/bearcli
NOTE_ID="paste-the-resolved-note-id"
"$BC" cat "$NOTE_ID" > "/tmp/diary-backup-$(date +%Y%m%d-%H%M%S).md"
```

**3. Prepend via read → splice → overwrite** (robust against dynamic anchors):

```bash
# new-week.md = the approved entry (ends with a trailing `---`)
"$BC" cat "$NOTE_ID" > /tmp/diary-current.md
python3 - "$NOTE_ID" /tmp/diary-current.md /tmp/new-week.md <<'PY'
import re, subprocess, sys
note_id, cur_path, new_path = sys.argv[1], sys.argv[2], sys.argv[3]
cur = open(cur_path, encoding="utf-8").read()
block = open(new_path, encoding="utf-8").read().rstrip("\n") + "\n"
m = re.search(r"(?m)^# \d{4}-\d{2}-\d{2}\b", cur)   # first existing week heading
if not m:
    sys.exit("Could not find a week heading to insert before — aborting.")
out = cur[:m.start()] + block + cur[m.start():]
subprocess.run(["/Applications/Bear.app/Contents/MacOS/bearcli",
                "overwrite", note_id], input=out, text=True, check=True)
PY
```

**4. Verify:** `"$BC" cat "$NOTE_ID" | head -40` and confirm the new `# <date>` block
now sits directly under the `⭐` header, above last week's block, with its
trailing `---` intact. If anything looks wrong, restore from the backup with
`overwrite`.

## Golden rules

- **Locate the note dynamically; never hardcode the note id** — it rotates each half.
- **Draft → confirm → back up → overwrite.** Always show the entry and dump a
  backup before touching the live note.
- **Prepend, don't append** — newest week goes at the top, under the standing header.
- **Fill Goal Progress every week**, interviewing the user one goal at a time.
- **Walk the user through all five optional sections (Wins / Fails / Kudos /
  Decisions / Ideas) one at a time** — one focused question each, proposing any
  candidate you spotted; never silently drop them; only delete a heading after the
  user confirms it's empty.
- **Include every status update written**, each demoted one heading level under a
  linked h3, with the Howie `<!-- data -->` markers stripped.
