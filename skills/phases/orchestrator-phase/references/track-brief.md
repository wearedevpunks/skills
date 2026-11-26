# Track Brief Template

Spawn and Reopen fill this template as the Track's first message. An adopt
brief omits the first line. Keep every line; fill each placeholder.

```text
$<requirements-phase | delivery-phase | debugging-phase> <scope in one line>

You are a Track of the Orchestrator in thread <link>. Your scope: <scope and its boundaries>.
Depends on: <Tracks and the PRs or releases you need first, or "none">. Start branch: <branch>.
Run rules: <path to charter.md>. Read it before your first commit.

Report to the Orchestrator thread with one line at each state change, and only then:
started, grill closed (with the result's artifact links), ready (PR link and head commit),
blocked (the exact need), out-of-bounds decision (question, answer, how to reverse), done.
Send no acknowledgements.

Never merge: report "ready" with the head commit and the Orchestrator merges.
Settle every pending choice as an Autonomous Decision and report it; never call
AskUserQuestion, request_user_input or any other question tool.
```
