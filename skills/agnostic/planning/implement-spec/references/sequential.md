# Sequential Execution

Use this approach when execution should stay serial while avoiding main-context implementation churn.

## Sequential contract

- **Mode:** `sequential`
- **Worker policy:** spawn exactly one implementation worker
- **Execution board:** completed, in progress, next, blocked

## Quick start

1. Load the shared lifecycle from `lifecycle.md`.
2. Record `sequential` under **Execution mode** in `IMPLEMENTATION-NOTES.md`.
3. Read `.agents/subagents/manifest.mjs` when present and choose the best specialist for the whole sequential implementation.
4. Spawn one worker with the full spec folder, plan, lifecycle rules, required skills, task order, and update obligations.
5. Require the worker to execute one task at a time in dependency order.
6. After worker handoff, review the diff, plan updates, notes, and validation evidence before finalization.
7. Run any parent-level acceptance or smoke checks needed to trust the worker output.

## Task loop

The worker owns this loop for every task:

1. start from `tdd_target`
2. validate through the task's public interface
3. run the task-level validation gate before marking it done
4. update the execution board before advancing

The parent owns:

- worker brief quality
- post-handoff review
- acceptance-criteria audit
- manual review checklist
- final spec-folder status

Stop only when all reachable tasks are complete or a real blocker remains.
