---
name: parallel-task
description: Run wave-based parallel execution for an approved plan. Only trigger from explicit `/parallel-task` commands when the user wants direct orchestration of unblocked tasks.
---

# Parallel Task

This is the explicit-command entrypoint for the same wave-based execution contract used by `$domain-execute` in `parallel` mode.

Own the orchestration loop yourself. Worker spawning is only one part of the job.

## Process

### 1. Parse the request

Extract from user request:

- **Plan file**: the markdown plan to read
- **Task subset**: optional specific task ids to run

If no subset is provided, run the full plan.

### 2. Read and parse the plan

Find task subsections such as `### T1:` or `### Task 1.1:`.

For each task, extract:

- task id and name
- `depends_on`
- location
- description
- acceptance criteria
- validation
- `tdd_target`
- `review_mode`
- backlog metadata when present
- relevant plan-level risks or constraints

Build the task list from that data.

If a task subset was requested, filter to those ids plus every required dependency.

### 3. Build the current wave

A task is unblocked only when all ids in its `depends_on` list are complete.

For the current wave:

- include every unblocked task
- exclude already-complete tasks
- exclude tasks blocked by failed prerequisites

Launch all unblocked tasks in parallel.

### 4. Spawn workers

Each worker brief must include:

- plan context
- task id and name
- dependencies
- related tasks when relevant
- file locations
- full description
- acceptance criteria
- validation contract
- `tdd_target`
- `review_mode`
- relevant risks or constraints

Each worker brief must require:

1. read the plan and relevant files first
2. do targeted codebase research before editing
3. start from `tdd_target` and capture RED evidence when the task is testable
4. record `reason_not_testable` plus exact alternative verification when the task is not a good TDD candidate
5. treat RED-phase tests or the approved non-testable verification plan as the implementation contract
6. implement only the assigned task scope
7. run the exact task validation before returning
8. update the plan entry with status, log, touched files, and gotchas before handoff closes

Worker output must return:

- files modified or created
- concise summary of changes
- how acceptance criteria are satisfied
- verification evidence: RED -> GREEN or the exact alternative verification run
- validation intentionally deferred
- anything blocked or risky

### 5. Review and validate the wave

After workers return:

1. inspect outputs for correctness and completeness
2. validate against the task contract
3. ensure the plan entry reflects completed status, execution log, and touched files
4. retry or escalate failed work instead of quietly advancing

Move to the next wave only after the current wave is validated and logged.

### 6. Repeat

Re-read the plan state, compute the next wave, and continue until:

- all reachable tasks are complete
- or a real blocker remains

## Completion rule

A task is complete only when all are true:

- assigned scope is finished
- acceptance criteria are satisfied
- RED -> GREEN evidence exists for testable tasks, or exact alternative verification exists
- validation evidence matches the task contract
- the plan entry reflects status, log, and touched files

If any are missing, the task is not done yet.

## Error handling

- Task subset not found: list available task ids
- Parse failure: show what was tried, ask for clarification
