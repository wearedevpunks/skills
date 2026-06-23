# Sequential Execution

Use this approach when execution should stay serial while avoiding main-context implementation churn.

## Sequential contract

- **Mode:** `sequential`
- **Worker policy:** spawn exactly one implementation worker
- **Execution board:** completed, in progress, next, blocked

Hard gate: sequential implementation never runs in the parent main thread. If the worker cannot be spawned or routed, stop and repair the worker guard or report the blocker.

## Quick start

1. Load the shared lifecycle from `lifecycle.md`.
2. Record `sequential` under **Execution mode** in `IMPLEMENTATION-NOTES.md`.
3. Read `.agents/subagents/manifest.mjs` when present and choose the best specialist for the whole sequential implementation.
4. Spawn one worker with the full spec folder, plan, lifecycle rules, required skills, task order, and update obligations.
5. If any assigned task changes UI, include the screenshot evidence contract from [ui-screenshot-evidence.md](ui-screenshot-evidence.md) in the worker brief.
6. Require the worker to execute one task at a time in dependency order.
7. After worker handoff, review the diff, plan updates, notes, and validation evidence before finalization.
8. Run any parent-level acceptance or smoke checks needed to trust the worker output.

## Task loop

The worker owns this loop for every task:

1. start from `tdd_target`
2. read `codebase_design_notes` and preserve the intended interface, seam, adapter, and test surface unless implementation proves the plan wrong
3. classify `tdd_status` and honor the task's RED/GREEN contract
4. for behavior-changing work, run `red_command`, verify `expected_red_failure`, and record `red_evidence` before production edits
5. patch only enough production code to pass the public behavior
6. run `green_command`, record `green_evidence`, and only then mark the task done
7. for non-testable or non-applicable tasks, record `reason_not_testable` plus the exact alternative verification
8. for UI implementation changes, capture and link durable before/after screenshot evidence
9. update the execution board before advancing

The parent owns:

- worker brief quality
- post-handoff review
- acceptance-criteria audit
- manual review checklist
- final spec-folder status

Stop only when all reachable tasks are complete or a real blocker remains.
