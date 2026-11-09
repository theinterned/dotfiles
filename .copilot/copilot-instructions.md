# Personal Copilot CLI instructions

User-level instructions applied across all repositories on this machine.

## User-facing communication

- Lead with the practical answer.
- Use short sentences and everyday words.
- Define necessary technical terms immediately.
- Avoid unexplained acronyms and internal jargon.
- Use examples for concepts that can confuse non-specialists.
- Preserve precision without needlessly complex phrasing.

## npm package downloads

- If an npm install fails because registry access is blocked or requires
  authentication, retry through Central Feed Services (CFS) using the dotfiles
  shortcuts: `ni` for `npm install`, `ni <package>` to install a package, and
  `nci` for `npm ci`. Preserve the original arguments and working directory.
- The `npx` alias also runs through CFS. Use it for npx commands that download
  tools, including retries after registry or authentication failures.
- Shell aliases and Fish abbreviations may not be available in non-interactive
  agent shells. In that case, use their equivalents directly:
  `gh cfs -- npm install`, `gh cfs -- npm ci`, or `gh cfs -- npx`.
  Preserve npx options and tool arguments; do not add `--yes` automatically.
- If CFS is missing, run `bash ~/.dotfiles/script/setup-cfs`. If Azure CLI or
  GitHub CLI is missing, install them with `brew install azure-cli gh` first.
  Ask the user to complete Azure sign-in when required; each Codespace needs
  its own login. Use `gh cfs doctor --auth` to check authentication.
- Never bypass CFS by changing registries, disabling security checks, or
  removing lockfiles or integrity hashes. Do not retry unrelated dependency,
  build, or lifecycle-script failures as authentication problems.
- Use this employee-login setup only for local development and personal
  Codespaces, not CI or unattended workloads. Tests and builds need no wrapper
  unless they download packages.

### github-ui bootstrap

- For trusted `github/github-ui` local development or personal Codespaces, if
  setup fails on npm registry access or authentication, use the repo-required
  Node version, complete CFS setup/sign-in above, and run from the worktree root:
  `gh cfs -- npm run env -- script/bootstrap`.
- This supplies temporary CFS authentication to nested npm/npx downloads
  without editing registry settings or lockfiles.
- Do not use `gh cfs -- npm exec --call='script/bootstrap'`: the inherited
  npm exec call setting causes nested npx commands to fail with `EUSAGE`.
- This workaround does not fix Node-version mismatches or unrelated build
  failures; diagnose those separately.

## Datadog

- Prefer the `dd-pup` skill and Datadog's `pup` CLI for Datadog investigations
  rather than the Datadog MCP server or browser automation.
- Check `pup auth status` before use. If sign-in is needed, ask the user to
  complete `pup auth login --read-only` for investigations. Do not copy tokens
  from the MCP plugin or store credentials in dotfiles.
- Use `--read-only` for investigation commands. Request additional permissions
  only when the user asks for an operation that needs them.

## GitHub references

- Always fully qualify issue and pull request numbers; never write a bare
  reference such as `#1234`.
- In pull request and issue bodies, use `org/repo-name#1234`.
- In ordinary documentation, including Markdown files, use the full URL:
  `https://github.com/org/repo-name/issues/1234` for issues or
  `https://github.com/org/repo-name/pull/1234` for pull requests.
- Backticks in these examples are Markdown formatting only; omit them from the
  actual references.

## Pull request relationships

- At the very top of every pull request description, add a bullet for each
  issue the pull request closes, even when the issue is in another repository
  or GitHub will not close it automatically.
- Use a full URL in each relationship bullet. For example:
  `- Closes https://github.com/org/repo-name/issues/1234`
- Put other relevant pull request or issue relationships in the same opening
  bullet list. For example: `- Follow up to https://github.com/org/repo-name/pull/1234`
  or `- Related Rails change: https://github.com/org/repo-name/pull/1234`.

## Issue relationships

- When drafting GitHub issues, record parent, child, blocking, and blocked-by
  relationships with GitHub's issue relationship features instead of repeating
  them in the issue-description Markdown.
- Do not add Markdown sections or lines that only identify a parent issue or
  describe blocking relationships.
- Relationship details may appear in the Markdown when they are necessary to
  explain the issue's narrative, context, or implementation constraints.
- When the available GitHub tools cannot set a blocking relationship, use
  `gh api graphql` with GitHub's native `addBlockedBy` or `removeBlockedBy`
  mutation. Do not use Markdown as a fallback for the missing tool operation.

## Code comment quality

Comments state only the facts needed to interpret what the code does and its
current state. They must not contain narrative, planning, methodology, or
issue-sequencing.

- A header like `WHAT THIS BRANCH DELIVERS:` belongs in a PR description, not in
  a code comment. The code is the permanent record; process history is not.
- Record deferred context only when it matters — e.g. a glaring, intentional
  omission planned as a follow-up. Use `// TODO: {issue link}: {context}`.
- Otherwise, stick to facts and current state.
