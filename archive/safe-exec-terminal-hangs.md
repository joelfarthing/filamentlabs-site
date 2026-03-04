---
trigger: always_on
---

---
trigger: always_on
description: Critical Agent Terminal Constraints and Anti-Hanging Protocols
---

# AGENT TERMINAL SAFETY PROTOCOLS (FATAL ERROR IF IGNORED)

Your `run_command` terminal environment is non-interactive. It WILL permanently hang if you execute commands that block on I/O, open interactive pagers, produce massive stdout, or wait for user input.

## Forbidden Commands

You are STRICTLY FORBIDDEN from running the following directly:

1. `nano`, `vim`, `top`, `htop`, `less`, `more`, or any interactive TTY program.
2. Long-running network operations (e.g., large `npm install`, `git clone` of large repos) without setting `WaitMsBeforeAsync` appropriately.
3. Commands that prompt for user input (e.g., `npm init` without `-y`, `git commit` without `-m`).
4. Commands that dump huge text to stdout (e.g., `cat` on a large file — use `view_file` instead).

## safe_exec Protocol

For any long-running or high-output command, use the project's `safe_exec` wrapper:

1. **Never** use direct background tracking with repeated `command_status` polling for heavy commands.
2. Launch with: `scripts/safe_exec.sh <job_id> "<command>"`  
   (The script lives at `scripts/safe_exec.sh` in this workspace.)
3. A job is complete only when `/tmp/agent_job_<job_id>.exit` exists.
4. Read output from:
   - `/tmp/agent_job_<job_id>.out`
   - `/tmp/agent_job_<job_id>.err`
5. If three attempts fail with the same/similar error, stop and ask the user for direction (see anti-loop rule).
6. Before any heavy command, explicitly state: `Using safe_exec for this long/high-output command.`

## Hang Recovery

If a command hangs or times out, YOU MUST STOP. Never blindly retry a hung command. Ask the user to run the command manually in their host terminal and paste the output.

## Commands Typically Safe to Run Directly

For this static HTML/CSS/JS project, these are generally safe without `safe_exec`:
- `git add`, `git commit`, `git push`, `git status`, `git diff` (small diffs)
- `ls`, `find`, `grep` (with reasonable scope)
- `gh repo create`, `gh pr create`
- Brief `npm` commands for any future tooling (linters, formatters)