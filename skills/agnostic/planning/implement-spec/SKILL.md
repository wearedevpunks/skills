---
name: implement-spec
description: Implement an agent-ready spec folder through plan-derived worker waves while keeping `IMPLEMENTATION-NOTES.md`, `PLAN.md`, and spec-linked tech debt in sync. Use when an agent-ready spec already has an execution-ready `PLAN.md`.
---

# Implement Spec

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** agent-ready spec folder with `SPEC.md` and `PLAN.md`
- **Delegates to:** `$tdd`, `$codebase-design`, `$simplify`, tiny `$requirements-phase` sessions for debt ambiguity, and internal worker-wave orchestration
- **Downstream:** `docs-ingest-phase` when the resulting spec folder should be ingested into domain knowledge
- **Entry conditions:** existing agent-ready spec folder; stop and use `create-plan` if `PLAN.md` is missing
- **Stop conditions:** shared acceptance audit complete, final manual review checklist written, spec folder finalized, blocked work reported honestly

## Required Inner Skills

- MUST use `$tdd`
- MUST use `$codebase-design`
- MUST use `$simplify`
Use `$agent-browser` when any task `review_mode` is `browser` or `mixed`.

## Worker-wave responsibilities

Follow [references/parallel.md](references/parallel.md) as the execution contract.

The parent owns wave orchestration and shared artifacts. Scoped workers own
implementation tasks.

## Quick start

1. Resolve the target spec folder by checking, in order: `apps/wiki/content/docs/project/specs/<domain>/<spec>/`, legacy `apps/wiki/specs/<domain>/<spec>/`, then `docs/specs/<domain>/<spec>/`.
2. Read `references/lifecycle.md` and follow the shared execution contract exactly.
3. Read `references/parallel.md`, parse the plan graph, and build the first unblocked wave.
4. Launch scoped workers for the current wave using `references/parallel-worker-brief.md`.
5. After each validated wave, update `PLAN.md`, `IMPLEMENTATION-NOTES.md`, and spec-linked tech debt before advancing.
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
- Worker-wave execution: see [references/parallel.md](references/parallel.md)
- Plan parsing and wave construction: see [references/parallel-orchestration.md](references/parallel-orchestration.md)
- Worker brief contract: see [references/parallel-worker-brief.md](references/parallel-worker-brief.md)
