# Parallel Execution

Use this approach when execution should fan out across independent tasks or waves.

When `implement-spec` chooses `parallel` mode, this reference is the full contract for parallel execution.

## Parallel contract

- **Mode:** `parallel`
- **Worker policy:** spawn workers only for currently unblocked work
- **Execution board:** completed, in progress, unblocked next, blocked, current wave

## Adoption rule

In `parallel` mode, `implement-spec` must do all of the orchestration work itself.

That includes:

1. parsing `PLAN.md`
2. extracting task ids, names, `depends_on`, locations, descriptions, acceptance criteria, validations, and related metadata
3. building the current wave from the unblocked tasks
4. spawning workers for that wave
5. reviewing worker results for correctness and completeness
6. updating plan logs and execution notes
7. repeating until all reachable tasks are complete or a real blocker remains

Do not treat worker spawning as the whole job. The orchestration loop is part of this mode.

## Quick start

1. Load the shared lifecycle from `lifecycle.md`.
2. Record `parallel` under **Execution mode** in `IMPLEMENTATION-NOTES.md`.
3. Read `.agents/subagents/manifest.mjs` before the first spawn and choose explicit worker templates per task.
4. In Codex, read [parallel-reasoning.md](parallel-reasoning.md) and set each worker `reasoning_effort` lower than the parent orchestrator.
5. Read [parallel-orchestration.md](parallel-orchestration.md) and parse `PLAN.md` into a task graph.
6. Build the current wave from the unblocked tasks only.
7. Read [parallel-worker-brief.md](parallel-worker-brief.md) and use that contract when spawning workers.
8. Validate each wave before moving on. Fix failures before the next wave.
9. Update the plan, notes, and tech debt after every wave.

## Required evidence

- plan-derived wave selection
- explicit worker briefs per task
- explicit Codex worker `reasoning_effort` when running in Codex
- post-wave review of worker outputs
- acceptance-criteria coverage plus RED -> GREEN evidence, or explicit non-testable verification
- task completion only after validation and plan/log updates
- clear reporting of retries, issues, or blockers

## Loop rule

Keep iterating wave by wave until:

- all reachable tasks are complete, validated, and logged
- or a real blocker remains and is reported honestly

Do not quietly skip failed work. Retry or escalate instead.
