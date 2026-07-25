---
description: Generate a conventional commit message from the current staged/unstaged changes. Returns the message only — does NOT execute the commit.
---

# /commit — Conventional Commit Generator

## Rules — read carefully

1. Load the `git-commit` skill from `.agents/skills/git-commit/SKILL.md` using the `skill` tool.
2. Run `git status --short` and `git diff --staged` to see ALL changed files.
3. If nothing is staged, run `git diff` to see unstaged changes and suggest what to stage.
4. Group changes logically by type (feat, fix, refactor, chore, test, docs, style).
5. Generate a SINGLE conventional commit message with:
   - Type + optional scope: `feat(companies): add card grid with responsive layout`
   - A short description (imperative, ≤72 chars)
   - If needed, a blank line followed by bullet points for important details
6. Show the user:
   - The changed files detected
   - The proposed commit message
   - A reminder to review and execute manually with `git commit`
7. **NEVER run `git commit`, `git add`, or any git mutation command.**
   **NEVER stage files yourself.**
   **Return the message for the user to execute.**
