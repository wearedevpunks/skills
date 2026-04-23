# Sequential Execution

Use this approach when execution should stay in one thread without worker fan-out.

## Sequential contract

- **Mode:** `sequential`
- **Worker policy:** do not spawn workers
- **Execution board:** completed, in progress, next, blocked

## Quick start

1. Load the shared lifecycle from `lifecycle.md`.
2. Record `sequential` under **Execution mode** in `IMPLEMENTATION-NOTES.md`.
3. Execute one task at a time in dependency order.
4. After every task, run the task-level validation gate before marking it done.
5. Update plan status, logs, touched files, notes, and tech debt immediately.

## Task loop

For every task:

1. start from `tdd_target`
2. validate through the task's public interface
3. run the task-level validation gate before marking it done
4. update the execution board before advancing

Stop only when all reachable tasks are complete or a real blocker remains.
