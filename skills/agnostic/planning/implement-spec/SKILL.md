---
name: implement-spec
description: Implement an approved spec folder while keeping `IMPLEMENTATION-NOTES.md`, `PLAN.md`, and spec-linked tech debt in sync. Use when a reviewed spec already has a `PLAN.md` and execution should proceed either sequentially in one thread or in parallel with explicit worker orchestration.
---

# Implement Spec

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** reviewed spec folder with `SPEC.md` and `PLAN.md`
- **Delegates to:** `$tdd`, `$simplify`, and internal worker orchestration in parallel mode
- **Downstream:** `docs-maintenance` when the resulting spec folder should be ingested into domain knowledge
- **Entry conditions:** existing reviewed spec folder; stop and use `create-plan` if `PLAN.md` is missing
- **Stop conditions:** shared acceptance audit complete, spec folder finalized, blocked work reported honestly

## Required Inner Skills

- MUST use `$tdd`
- MUST use `$simplify`
Use `$agent-browser` when any task `review_mode` is `browser` or `mixed`.

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

1. Resolve the target spec folder under `<wiki-root>/specs/<domain>/<spec>/`.
2. Read `references/lifecycle.md` and follow the shared execution contract exactly.
3. Choose the execution mode explicitly:
   - Read `references/sequential.md` for one-thread execution.
   - Read `references/parallel.md` for wave-based worker execution.
4. Record the chosen mode under **Execution mode** in `IMPLEMENTATION-NOTES.md` before coding.
5. Execute only the chosen mode. Do not mix modes inside one run.
6. After each completed task or wave, update `PLAN.md`, `IMPLEMENTATION-NOTES.md`, and spec-linked tech debt before advancing.
7. Finish with the shared acceptance audit and spec finalization contract.

## Mode selection

Choose `sequential` when:

- the user wants single-threaded execution
- tasks are tightly coupled
- worker handoff cost would outweigh parallelism

Choose `parallel` when:

- the user wants explicit parallel execution
- the plan contains independent waves
- disjoint write scopes make worker fan-out safe

If the user already chose a mode, honor it. If not, make the smallest safe choice and state it.

## Advanced features

- Shared lifecycle, notes contract, tech-debt rules, acceptance audit, finalization: see [references/lifecycle.md](references/lifecycle.md)
- Sequential execution specifics: see [references/sequential.md](references/sequential.md)
- Parallel execution specifics: see [references/parallel.md](references/parallel.md)
- Parallel plan parsing and wave construction: see [references/parallel-orchestration.md](references/parallel-orchestration.md)
- Parallel worker brief contract: see [references/parallel-worker-brief.md](references/parallel-worker-brief.md)
