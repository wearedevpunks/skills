---
name: domain-execute
description: Execute an approved domain plan with dependency-aware swarms. Use when a reviewed *-plan.md already exists and work should run through parallel-task or parallel-task-spark with TDD-first task briefs, backlog updates, optional browser validation, and safe worktree-aware runtime behavior.
---

# Domain Execute

Execute only from an approved plan. Treat the plan as the source of truth.

## Prerequisites

- `$parallel-task`
- `$parallel-task-spark`
- `$tdd`
- `Agent Browser`
- optional `portless`

## Workflow

1. Read the current repo and the target `*-plan.md`.
   Derive host context from git remotes when repo-native operations are needed.

2. Gather missing run inputs.
   Confirm only what cannot be derived:
   - plan file
   - executor mode: `default` or `spark`
   - backlog target for this run

3. Prepare the plan for execution.
   Ensure every task has a concrete `tdd_target`, backlog references, and a valid `review_mode`.
   If a task is underspecified, enrich the plan before spawning workers.
   Treat `tdd_target` as the worker's required RED starting point.

4. Sync execution context back to backlog.
   Update each linked backlog item with the exact execution brief for that task before spawning its worker.
   The backlog entry should contain the same task-specific handoff the Orc gives the subagent, not just a summary.
   Include:
   - task objective
   - current status
   - dependencies
   - files or locations
   - TDD target
   - review mode
   - validation expectation
   - the concrete implementation plan or prompt the worker will execute

5. Keep backlog handoff in sync during execution.
   If the Orc materially refines a task brief, scope, validation target, or file list before re-prompting a worker, write that updated task-specific brief back to the linked backlog item as well.

6. Select the executor.
   - `default` -> invoke `$parallel-task`
   - `spark` -> invoke `$parallel-task-spark`

7. Apply `$tdd` rules to every task brief.
   Every worker brief must explicitly instruct the subagent to start with the `tdd_target` as the first failing test.
   Workers must validate behavior through public interfaces.
   Prefer vertical slices: failing test, minimal implementation, refactor if needed.
   Do not batch all tests first.

8. Run wave-based execution.
   Let the executor launch only unblocked tasks.
   Validate each wave before moving on.
   Ensure task status, logs, and touched files are written back to the plan.

9. Use runtime-aware validation.
   If `review_mode` is `browser` or `mixed`, use `Agent Browser` when browser-level validation is needed.
   If running inside a worktree and `portless` exists, prefer it for server-based validation to avoid port conflicts.

10. Finalize when complete.
   Sync backlog status and links.
   Push the current branch.
   Open the branch review or merge request using the repo's native hosting tool.

## Rules

- Use the plan as the source of truth; do not rely on hidden Orc memory.
- Treat planner-defined `tdd_target` fields as required execution inputs, not optional guidance.
- Persist each worker's exact task brief to its linked backlog item before spawn, and update that backlog entry if the brief materially changes later.
- Keep provider logic generic. Detect the right repo-native tool from runtime context.
- Stop clearly if the required execution or hosting tool is unavailable.
- `spark` mode requires the `sparky` role.
- Do not pause for additional human approval once execution begins unless a blocker is real.
