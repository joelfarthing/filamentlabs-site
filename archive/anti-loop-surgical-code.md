---
trigger: always_on
---

---
trigger: always_on
description: Anti-Looping and Surgical Code Modification Rules
---

# AGENT BEHAVIOR & EDITING PROTOCOLS

1. **THE 3-STRIKE RULE:** If you attempt to fix a bug, run a test, or execute a command and it fails with the same or similar error **THREE TIMES** in a row, YOU MUST IMMEDIATELY STOP. You are strictly forbidden from entering an autonomous retry loop. Stop and ask the user for human intuition or a change of direction.

2. **SURGICAL EDITS ONLY:** Never attempt to rewrite or replace an entire file unless it is under 100 lines or you are creating it from scratch. Always use your targeted `replace_file_content` or `multi_replace_file_content` tools to edit specific line ranges. Rewriting entire files wastes tokens and risks code truncation.

3. **VERIFY BEFORE MUTATING:** Never assume the directory structure or file contents. Before you edit any file you haven't explicitly read in the current session, you must use your file-viewing tools to confirm the exact line numbers and current state of the code. This is especially important for `.html`, `.css`, and `.js` files in this project—there is no build step or compiler to catch silent errors.

4. **NO FRAMEWORK UPGRADES:** This project is deliberately plain HTML/CSS/JS with no build step. Do not introduce frameworks, bundlers, or transpilers unless explicitly instructed by the user.