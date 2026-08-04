# Sequential Execution

Use this mode when user or plan intent requires serial execution, tasks are
tightly coupled, or parallel execution was not explicitly authorized.

## Sequential contract

- **Mode:** `sequential`
- **Worker policy:** spawn exactly one implementation worker
- **Parent policy:** orchestration, review, and parent validation
- **Execution board:** completed, in progress, next, blocked

Sequential implementation never runs in the parent thread. If the worker cannot
be spawned or routed, repair worker routing or report the blocker.

## Quick start

1. Load the shared lifecycle from [lifecycle.md](lifecycle.md).
2. Record `sequential` under **Execution Mode** in
   `IMPLEMENTATION-NOTES.md`.
3. Read `.agents/subagents/manifest.mjs` when present and choose the best
   specialist for the full implementation.
4. Spawn one worker with the spec folder, plan, lifecycle rules, required
   skills, task order, `owned_paths`, update obligations, and every runtime
   validation field.
5. Include [ui-screenshot-evidence.md](ui-screenshot-evidence.md) when any task
   changes UI.
6. Include [runtime-product-validation.md](runtime-product-validation.md) when
   any task requires runtime validation.
7. Require the worker to execute one task at a time in dependency order.
8. After handoff, review the diff, plan updates, notes, and validation evidence.
9. Run the parent acceptance or smoke checks needed to trust the result.

## Task loop

The worker owns this loop for every task:

1. Start from `tdd_target` and `codebase_design_notes`.
2. Honor the task's RED/GREEN contract before production edits.
3. Patch only enough production code to pass the public behavior.
4. Record `red_evidence` and `green_evidence`, or the accepted non-testable
   reason, before marking the task complete.
5. Capture required UI and runtime evidence; an exact blocker leaves the task
   blocked.
6. Update the execution board before advancing.

The parent owns worker-brief quality, post-handoff review, acceptance audit,
manual review checklist, and final spec-folder status.

Stop only when all reachable tasks are complete or a real blocker remains.
