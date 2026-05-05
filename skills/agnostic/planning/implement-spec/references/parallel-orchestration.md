# Parallel Orchestration

Use this reference to run the full parallel orchestration loop inside `implement-spec`.

## Step 1: Parse request

Extract from the user request:

1. the plan source to execute
2. an optional task subset

If no subset is provided, execute the full plan.

## Step 2: Read and parse `PLAN.md`

Find task subsections such as:

- `### T1:`
- `### Task 1.1:`

For each task, extract:

- task id and task name
- `depends_on`
- full content needed for execution:
  - location
  - description
  - acceptance criteria
  - validation
  - `tdd_target`
  - `review_mode`
  - backlog metadata when present
  - related tasks or plan-level constraints when they materially shape execution

Build the task list from this data.

If a task subset was requested:

- filter to the requested tasks
- include every required dependency first

## Step 3: Build the current wave

A task is unblocked only when all ids in its `depends_on` list are complete.

For the current wave:

- collect every unblocked task
- exclude already-complete tasks
- exclude tasks blocked by failed prerequisites

Launch all unblocked tasks in parallel.

## Step 4: Spawn workers

For each unblocked task:

- choose the worker template from `.agents/subagents/manifest.mjs`
- in Codex, apply the worker `reasoning_effort` policy from [parallel-reasoning.md](parallel-reasoning.md)
- use the worker-brief contract from [parallel-worker-brief.md](parallel-worker-brief.md)
- keep the task scope narrow
- ensure the worker owns only the assigned task and its required validation

## Step 5: Review and validate the wave

After the workers return:

1. inspect their outputs for correctness and completeness
2. compare the result against the task validation contract
3. ensure the task log and touched files were written back into `PLAN.md`
4. ensure non-obvious deviations or surprises were written into `IMPLEMENTATION-NOTES.md`
5. retry or escalate failed work instead of quietly advancing

Move to the next wave only after the current wave is validated and logged.

## Step 6: Repeat

Re-read the plan state and compute the next set of unblocked tasks.

Continue until:

- all reachable tasks are complete
- or a real blocker remains

## Completion rule

A task is complete only when all of the following are true:

- the worker finished the assigned scope
- acceptance criteria are satisfied, not only partially implemented
- RED -> GREEN evidence exists for testable tasks, or an explicit `reason_not_testable` plus exact alternative verification exists
- validation evidence matches the task contract
- `PLAN.md` reflects the completed status and execution log
- touched files are recorded
- any non-obvious deviations are reflected in `IMPLEMENTATION-NOTES.md`

If any of these are missing, the task is not done yet.

## Error handling

- If the requested task subset cannot be found, report the available task ids.
- If parsing fails, report what was tried and what is ambiguous.
- If a worker result is incomplete or incorrect, retry or escalate instead of marking the task complete.
