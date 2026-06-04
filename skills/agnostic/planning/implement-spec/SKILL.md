---
name: implement-spec
description: Implement an approved spec folder while keeping `IMPLEMENTATION-NOTES.md`, `PLAN.md`, and spec-linked tech debt in sync. Use when a reviewed spec already has a `PLAN.md` and execution should proceed through the default single-worker sequential path or explicit parallel worker waves.
---

# Implement Spec

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** reviewed spec folder with `SPEC.md` and `PLAN.md`
- **Delegates to:** `$tdd`, `$simplify`, tiny `$requirements-phase` sessions for debt ambiguity, and internal worker orchestration in sequential and parallel modes
- **Downstream:** `docs-ingest-phase` when the resulting spec folder should be ingested into domain knowledge
- **Entry conditions:** existing reviewed spec folder; stop and use `create-plan` if `PLAN.md` is missing
- **Stop conditions:** shared acceptance audit complete, final manual review checklist written, spec folder finalized, blocked work reported honestly

## Required Inner Skills

- MUST use `$tdd`
- MUST use `$simplify`
Use `$agent-browser` when any task `review_mode` is `browser` or `mixed`.

## Sequential responsibilities

When `implement-spec` runs in `sequential` mode, it must follow [references/sequential.md](references/sequential.md).

That means `implement-spec` itself owns orchestration and validation, while exactly one implementation worker owns the sequential coding loop. This keeps the parent context small and adds a parent review gate after worker handoff.

## Parallel responsibilities

When `implement-spec` runs in `parallel` mode, it must follow [references/parallel.md](references/parallel.md) as the full orchestration contract.

That means `implement-spec` itself owns all of the following in parallel mode:

- parsing `PLAN.md`
- finding the currently unblocked tasks from `depends_on`
- launching workers in waves
- reviewing worker outputs
- validating each wave before advancing
- ensuring `PLAN.md` and `IMPLEMENTATION-NOTES.md` are updated after each completed wave

## Quick start

1. Resolve the target spec folder under `apps/wiki/specs/<domain>/<spec>/`.
2. Read `references/lifecycle.md` and follow the shared execution contract exactly.
3. Choose the execution mode explicitly:
   - Read `references/sequential.md` for default single-worker sequential execution.
   - Read `references/parallel.md` for wave-based worker execution.
4. Record the chosen mode under **Execution mode** in `IMPLEMENTATION-NOTES.md` before coding.
5. Execute only the chosen mode. Do not mix modes inside one run.
6. After each completed task or wave, update `PLAN.md`, `IMPLEMENTATION-NOTES.md`, and spec-linked tech debt before advancing.
7. Resolve implementation debt as soon as it appears. Do not leave "later" work, TODOs, temporary compromises, or vague follow-up debt.
8. If a debt item needs a product/scope decision outside the active goal, stop and run a very small `$requirements-phase` clarification before continuing.
9. If backlog sync is in scope, keep epic/story bodies product-facing and use native metadata or comments instead of execution handoff rewrites.
10. Finish with the shared acceptance audit, manual review checklist, and spec finalization contract.

## Stack-aware branch gate

Before coding, inspect `PLAN.md` for `Branch/Base Intent`.

- If no `Branch/Base Intent` exists, continue with the normal execution flow.
- If it exists, verify the current branch is the intended child branch based on
  the intended parent branch, or create/switch to the intended child branch from
  the intended parent branch before implementation starts.
- Do not reinterpret intra-epic task dependencies as separate PRs.
- Default to PR-after-implementation: implement, commit, push, create or update
  the PR with the recorded base, then run `stack sync --dry-run`.
- If the dry-run preview is correct and reports pending stack changes, run
  `stack sync`.
- Early draft PRs are opt-in only when the user explicitly asks for them.
- If `stack` is unavailable and `Branch/Base Intent` exists, block the
  stack-dependent workflow. Missing `stack` does not block independent
  trunk-based work.

## Mode selection

Choose `sequential` when:

- the user wants single-threaded execution
- tasks are tightly coupled
- parallel worker handoff cost would outweigh parallelism
- the user did not choose a mode

Choose `parallel` when:

- the user wants explicit parallel execution
- the plan contains independent waves
- disjoint write scopes make worker fan-out safe

If the user already chose a mode, honor it. If not, choose `sequential` and state that it uses one implementation worker plus parent validation.

## Advanced features

- Shared lifecycle, notes contract, tech-debt rules, acceptance audit, finalization: see [references/lifecycle.md](references/lifecycle.md)
- Sequential execution specifics: see [references/sequential.md](references/sequential.md)
- Parallel execution specifics: see [references/parallel.md](references/parallel.md)
- Parallel plan parsing and wave construction: see [references/parallel-orchestration.md](references/parallel-orchestration.md)
- Parallel worker brief contract: see [references/parallel-worker-brief.md](references/parallel-worker-brief.md)
