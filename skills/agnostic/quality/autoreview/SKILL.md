---
name: autoreview
description: Run the OpenClaw structured review helper as the core review closeout workflow. Use when reviewing code, PRs, local diffs, branch ranges, or when review-phase needs its mandatory structured review pass.
---

# Autoreview

OpenClaw structured review is the core review workflow. It builds one review
bundle, runs one selected engine by default, validates structured findings, and
stops when no accepted/actionable findings remain.

Codex is the default engine when no engine is set.

## When Required

- `review-phase` is active.
- The user asks for review, PR review, branch review, second pass, or closeout.
- Non-trivial code edits are complete and ready for final/commit/ship.
- A prior review finding was fixed and needs confirmation.

## Contract

- Run this helper directly for structured review; do not substitute ad hoc
  nested `codex review`, reviewer panels, or another review workflow unless the
  user explicitly asks.
- Treat helper output as advisory. Verify every finding by reading the real code
  path, adjacent files, scoped guidance, and dependency docs/source when needed.
- Keep going until the helper exits cleanly or every remaining finding has been
  consciously rejected with evidence.
- If a review-triggered fix changes code, rerun focused validation and rerun
  autoreview for the affected target.
- Be patient with long model calls. Advancing heartbeat output is progress.
- Do not push just to review. Push only when the user requested push, ship, or
  PR update.

## Pick Target

Dirty local work:

```bash
.agents/skills/autoreview/scripts/autoreview --mode local
```

Branch or PR work:

```bash
.agents/skills/autoreview/scripts/autoreview --mode branch --base origin/main
```

Committed single change:

```bash
.agents/skills/autoreview/scripts/autoreview --mode commit --commit HEAD
```

Use `--mode auto` when unsure. Do not force local mode after committing; a clean
local review only proves there is no local patch.

## Optional Context

```bash
.agents/skills/autoreview/scripts/autoreview \
  --mode branch \
  --base origin/main \
  --prompt-file /tmp/review-notes.md \
  --dataset /tmp/evidence.json
```

Formatting can run before review. Tests can run through:

```bash
.agents/skills/autoreview/scripts/autoreview --parallel-tests "<focused test command>"
```

If tests or review lead to edits, rerun both until the target is stable.

## Final Report

Include:

- exact autoreview command
- tests/proof run
- findings accepted or rejected, with brief evidence
- final clean autoreview result, or why a remaining finding was rejected

See [REFERENCE.md](REFERENCE.md) for the full OpenClaw contract, helper options,
review panels, heartbeat handling, and GitHub/Gitcrawl gotchas.
