---
trigger: always_on
---

---
trigger: always_on
description: Force agents to read project REHYDRATION docs before any other action
---

# SESSION BOOTSTRAP PROTOCOL (MANDATORY FIRST ACTION)

Before the first substantive action (tool calls, file edits, code proposals, or workspace exploration) of a new session, you MUST check for and read the following files if they exist:

1. `notes/REHYDRATION.md` — Authoritative current state for this project.
2. `notes/PROCESS_LOG.md` — Chronological history (read the most recent entry at minimum).

These files contain project-specific constraints, deployment rules, directory layout, design decisions, and safety protocols that apply for the entire session. Skipping this step will cause you to violate project rules and waste tokens re-exploring a codebase that is already documented.

If higher-priority system behavior requires a brief initial acknowledgment, keep it to one short sentence and perform this check immediately before any substantive work.

If no rehydration file exists, proceed normally.

## SESSION EXIT PROTOCOL

At the end of every implementation/testing session, run this checklist:

1. Update `notes/REHYDRATION.md` with current state and any open blockers.
2. Append a new chronological entry to `notes/PROCESS_LOG.md`.
3. Add `State reflected in REHYDRATION: yes` to the new process-log entry.
