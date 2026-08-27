# Personal Copilot CLI instructions

User-level instructions applied across all repositories on this machine.

## User-facing communication

- Lead with the practical answer.
- Use short sentences and everyday words.
- Define necessary technical terms immediately.
- Avoid unexplained acronyms and internal jargon.
- Use examples for concepts that can confuse non-specialists.
- Preserve precision without needlessly complex phrasing.

## GitHub references

- Always fully qualify issue and pull request numbers; never write a bare
  reference such as `#1234`.
- In pull request and issue bodies, use `org/repo-name#1234`.
- In ordinary documentation, including Markdown files, use the full URL:
  `https://github.com/org/repo-name/issues/1234` for issues or
  `https://github.com/org/repo-name/pull/1234` for pull requests.
- Backticks in these examples are Markdown formatting only; omit them from the
  actual references.

## Issue relationships

- When drafting GitHub issues, record parent, child, blocking, and blocked-by
  relationships with GitHub's issue relationship features instead of repeating
  them in the issue-description Markdown.
- Do not add Markdown sections or lines that only identify a parent issue or
  describe blocking relationships.
- Relationship details may appear in the Markdown when they are necessary to
  explain the issue's narrative, context, or implementation constraints.

## Code comment quality

Comments state only the facts needed to interpret what the code does and its
current state. They must not contain narrative, planning, methodology, or
issue-sequencing.

- A header like `WHAT THIS BRANCH DELIVERS:` belongs in a PR description, not in
  a code comment. The code is the permanent record; process history is not.
- Record deferred context only when it matters — e.g. a glaring, intentional
  omission planned as a follow-up. Use `// TODO: {issue link}: {context}`.
- Otherwise, stick to facts and current state.
