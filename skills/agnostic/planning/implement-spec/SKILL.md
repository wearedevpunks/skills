---
name: implement-spec
description: Implement an agent-ready spec folder through default single-worker sequential execution or explicitly authorized parallel waves while keeping `IMPLEMENTATION-NOTES.md`, `PLAN.md`, and spec-linked tech debt in sync. Use when an agent-ready spec already has an execution-ready `PLAN.md`.
---

# Implement Spec

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** agent-ready spec folder with `SPEC.md` and `PLAN.md`
- **Delegates to:** `$tdd`, `$codebase-design`, `$simplify`, tiny `$requirements-phase` sessions for debt ambiguity, and internal worker orchestration in sequential or parallel mode
- **Downstream:** `docs-ingest-phase` when the resulting spec folder should be ingested into domain knowledge
- **Entry conditions:** existing agent-ready spec folder; stop and use `create-plan` if `PLAN.md` is missing
- **Stop conditions:** shared acceptance audit complete, final manual review checklist written, spec folder finalized, blocked work reported honestly

## Required Inner Skills

- MUST use `$tdd`
- MUST use `$codebase-design`
- MUST use `$simplify`
Use `$agent-browser` when any task `review_mode` is `browser` or `mixed`.

## Execution responsibilities

Choose execution mode from explicit user or plan intent. Default to `sequential`
when neither authorizes parallel execution.

- In `sequential`, follow [references/sequential.md](references/sequential.md):
  exactly one implementation worker owns the coding loop; the parent
  coordinates, reviews, and validates.
- In `parallel`, follow [references/parallel.md](references/parallel.md): the
  parent orchestrates explicitly authorized independent waves with disjoint
  write scopes. Dependencies may produce one-task waves.

## Quick start

1. Resolve the target spec folder by checking, in order: `apps/wiki/content/docs/project/specs/<domain>/<spec>/`, legacy `apps/wiki/specs/<domain>/<spec>/`, then `docs/specs/<domain>/<spec>/`.
2. Read `references/lifecycle.md` and follow the shared execution contract exactly.
3. Choose `sequential` or `parallel` from user or plan intent, then load only
   the selected mode reference.
4. Record the chosen mode under **Execution Mode** in
   `IMPLEMENTATION-NOTES.md`. Do not mix modes unless the user redirects.
5. Execute the selected mode and update `PLAN.md`, `IMPLEMENTATION-NOTES.md`,
   and spec-linked tech debt after each completed task or wave.
6. Use `$codebase-design` vocabulary while reviewing each worker change: interface, seam, adapter, depth, leverage, locality, and test surface.
7. Resolve implementation debt as soon as it appears. Do not leave "later" work, TODOs, temporary compromises, or vague follow-up debt.
8. If a debt item needs a product/scope decision outside the active goal, stop and run a very small `$requirements-phase` clarification before continuing.
9. If backlog sync is in scope, keep epic/story bodies product-facing and use native metadata or comments instead of execution handoff rewrites.
10. For UI implementation changes, follow [references/ui-screenshot-evidence.md](references/ui-screenshot-evidence.md) and use `repo-asset-management` for durable before/after asset links.
11. For tasks with `runtime_validation: required`, follow [references/runtime-product-validation.md](references/runtime-product-validation.md) and do not mark them complete without conclusive runtime evidence; an exact blocker keeps the task blocked.
12. Finish with the shared acceptance audit, manual review checklist, and spec finalization contract.

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

## Advanced features

- Shared lifecycle, notes contract, tech-debt rules, acceptance audit, finalization: see [references/lifecycle.md](references/lifecycle.md)
- UI before/after screenshot evidence and PR handoff links: see [references/ui-screenshot-evidence.md](references/ui-screenshot-evidence.md)
- Supported-runtime proof and cleanup contract: see [references/runtime-product-validation.md](references/runtime-product-validation.md)
- Sequential execution: see [references/sequential.md](references/sequential.md)
- Parallel execution: see [references/parallel.md](references/parallel.md)
- Parallel plan parsing and wave construction: see [references/parallel-orchestration.md](references/parallel-orchestration.md)
- Parallel worker brief contract: see [references/parallel-worker-brief.md](references/parallel-worker-brief.md)
