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

## Code comment quality

Comments state only the facts needed to interpret what the code does and its
current state. They must not contain narrative, planning, methodology, or
issue-sequencing.

- A header like `WHAT THIS BRANCH DELIVERS:` belongs in a PR description, not in
  a code comment. The code is the permanent record; process history is not.
- Record deferred context only when it matters — e.g. a glaring, intentional
  omission planned as a follow-up. Use `// TODO: {issue link}: {context}`.
- Otherwise, stick to facts and current state.
