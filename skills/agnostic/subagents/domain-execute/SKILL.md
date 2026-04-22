---
name: domain-execute
description: Execute an approved domain plan in sequential or wave-based parallel mode. Use when a reviewed *-plan.md already exists and work should proceed with explicit TDD targets, review-mode validation, plan upkeep, optional backlog sync, and honest blocker handling.
---

# Domain Execute

Execute only from an approved plan. Treat the plan as the source of truth.

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** reviewed `*-plan.md`
- **Delegates to:** `$tdd`, `$simplify`, optional worker orchestration in `parallel` mode
- **Entry conditions:** existing approved plan with concrete tasks and execution metadata
- **Stop conditions:** reachable work complete, validations run, blockers reported honestly

## Required inner skills

- MUST use `$tdd`
- MUST use `$simplify`
- `Agent Browser` for `browser` and `mixed` review modes

## Mode selection

Choose `sequential` when tasks are tightly coupled or single-thread execution is safer.

Choose `parallel` when the plan has clear waves and disjoint write scopes.

If the user already chose a mode, honor it. If not, pick the smallest safe mode and state it.

## Workflow

1. Read the current repo and the target `*-plan.md`.
   Derive host context from git remotes when repo-native operations are needed.

2. Gather missing run inputs.
   Confirm only what cannot be derived:
   - plan file
   - execution mode: `sequential` or `parallel`
   - backlog target for this run if backlog sync is expected

3. Prepare the plan for execution.
   Ensure every task has concrete `tdd_target` and `review_mode` fields.
   Preserve backlog references when present.
   If a task is underspecified, enrich the plan before execution starts.
   Treat `tdd_target` as the required RED starting point.

4. Keep an execution board visible.
   Track:
   - completed
   - in progress
   - unblocked next
   - blocked
   - current wave

5. Sync execution context back to backlog when backlog refs exist.
   Before spawning work, write the exact task brief back to the linked backlog item.
   If the brief materially changes later, sync it again.

6. Apply `$tdd` rules to every task brief.
   Every task or worker brief must start from the `tdd_target` as the first failing test when the task is testable.
   Validate behavior through public interfaces.
   Prefer vertical slices: failing test, minimal implementation, refactor if needed.
   Do not batch all tests first.

7. Execute the chosen mode.
   - `sequential`: run one reachable task at a time, validate it, update the plan, then continue
   - `parallel`: parse the task graph, build the current wave from unblocked tasks only, spawn one worker per task, review the wave, then continue

8. After each completed task or wave:
   - update task status
   - append a concise execution log
   - record touched files
   - sync backlog status when backlog refs exist

9. Use runtime-aware validation.
   If `review_mode` is `browser` or `mixed`, use `Agent Browser` when browser-level validation is needed.
   If running inside a worktree and `portless` exists, prefer it for server-based validation to avoid port conflicts.

10. Run `$simplify` after code changes settle.
    Improve clarity without changing behavior.

11. Finalize honestly.
    Re-read plan validations and acceptance criteria.
    Mark work as met, unmet, or blocked.
    Report blockers clearly.
    Do not commit, push, or open review artifacts unless the user explicitly asks.

## Rules

- Use the plan as the source of truth; do not rely on hidden memory.
- Treat planner-defined `tdd_target` fields as required execution inputs, not optional guidance.
- Persist each worker's exact task brief to its linked backlog item before spawn, and update that backlog entry if the brief materially changes later.
- Keep provider logic generic. Detect the right repo-native tool from runtime context.
- Stop clearly if the required execution tool is unavailable.
- Do not pause for additional human approval once execution begins unless a blocker is real.
