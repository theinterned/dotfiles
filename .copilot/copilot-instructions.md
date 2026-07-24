# Personal Copilot CLI instructions

User-level instructions applied across all repositories on this machine.

## Code comment quality

Comments state only the facts needed to interpret what the code does and its
current state. They must not contain narrative, planning, methodology, or
issue-sequencing.

- A header like `WHAT THIS BRANCH DELIVERS:` belongs in a PR description, not in
  a code comment. The code is the permanent record; process history is not.
- Record deferred context only when it matters — e.g. a glaring, intentional
  omission planned as a follow-up. Use `// TODO: {issue link}: {context}`.
- Otherwise, stick to facts and current state.
