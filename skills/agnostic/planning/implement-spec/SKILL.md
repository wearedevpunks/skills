---
name: implement-spec
description: Implement an agent-ready spec folder through a plan-derived Execution Frontier while keeping `IMPLEMENTATION-NOTES.md`, `PLAN.md`, and spec-linked tech debt in sync. Use when an agent-ready spec already has an execution-ready `PLAN.md`.
---

# Implement Spec

## Contract

- **Role:** higher-order execution orchestrator
- **Entrypoint type:** public entrypoint
- **Upstream:** agent-ready spec folder with `SPEC.md` and `PLAN.md`
- **Delegates to:** `$tdd`, `$codebase-design`, `$simplify`, tiny `$requirements-phase` sessions for debt ambiguity, and internal scoped-worker orchestration
- **Downstream:** `docs-ingest-phase` when the resulting spec folder should be ingested into domain knowledge
- **Entry conditions:** existing agent-ready spec folder; stop and use `create-plan` if `PLAN.md` is missing
- **Stop conditions:** shared acceptance audit complete, final manual review checklist written, spec folder finalized, blocked work reported honestly

## Required Inner Skills

- MUST use `$tdd`
- MUST use `$codebase-design`
- MUST use `$simplify`
- MUST use `$show-me`
Use `$agent-browser` when any task `review_mode` is `browser` or `mixed`.
Use `$verify-behavior` in `verify` mode when acceptance criteria are visibly
exercisable.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Execution responsibilities

Follow [references/parallel.md](references/parallel.md) as the execution contract.

The parent owns Task Gates, Active Write Scopes and shared artifacts. Scoped workers own
implementation tasks.

## Task identity state

Read the plan's uniform `task_identity_mode` before execution.

- `provider-task`: each `Tn` aliases one stable provider Task. Immediately
  activate `write-backlog` through its
  [delivery-status.md](../write-backlog/references/delivery-status.md) branch for
  a directly observed work start, blocker, pull request, merge, staging
  deployment, or production deployment. Require exact readback before
  advancing that Task and preserve its identity unchanged.
- `planning-only`: each `Tn` is the execution identity. Keep
  `backlog_item_id` and `backlog_item_url` as `not_applicable`, preserve
  `relation_mode: unprojected` and the skip reason, and advance from plan
  dependencies and validation. Emit no provider Task status or readback claim.

Provider mechanics remain inside `write-backlog`.

## Quick start

1. Resolve the target spec folder by checking, in order: `apps/wiki/content/docs/project/specs/<domain>/<spec>/`, legacy `apps/wiki/specs/<domain>/<spec>/`, then `docs/specs/<domain>/<spec>/`.
2. Read `references/lifecycle.md` and follow the shared execution contract exactly.
3. Read `references/parallel.md`, parse the plan graph, and compute the complete eligible Execution Frontier. When the plan is architecture-bearing, also read and enforce `references/architecture-conformance.md`.
4. Launch scoped workers for the eligible tasks using
   `references/parallel-worker-brief.md`. Forward every guidance item unchanged,
   preserving its `implementation_skill_guidance` skill and behavior fields.
5. Apply each returned Task Result's parent Task Gate immediately and recompute
   the Execution Frontier. Follow `references/parallel-orchestration.md` for
   stable-input checks, scope transfer, capacity queues and parent reconciliation.
   Architecture Checkpoints gate only consumers of unproved responsibilities;
   cumulative proof and final closure remain mandatory.
6. Use `$codebase-design` vocabulary while reviewing each worker change: interface, seam, adapter, depth, leverage, locality, and test surface.
7. Resolve implementation debt as soon as it appears. Do not leave "later" work, TODOs, temporary compromises, or vague follow-up debt.
8. If a debt item needs a product/scope decision outside the active goal, stop and run a very small `$requirements-phase` clarification before continuing.
9. Keep provider Task bodies owner-ready. Route lifecycle facts through
   `write-backlog` instead of rewriting Epic, Story, or Task bodies with
   execution handoff detail.
10. For UI implementation changes, follow [references/ui-screenshot-evidence.md](references/ui-screenshot-evidence.md) and use `repo-asset-management` for durable before/after asset links.
11. For tasks with `runtime_validation: required`, follow [references/runtime-product-validation.md](references/runtime-product-validation.md) and do not mark them complete without conclusive runtime evidence; an exact blocker keeps the task blocked.
12. After task and runtime checks, run `$verify-behavior` in `verify` mode for
    visibly exercisable acceptance criteria before final acceptance
    classification. A mismatch is runtime evidence: route it to
    `debugging-phase`. If the required interaction capability is unavailable,
    record the explicit blocker and keep affected acceptance criteria blocked.
13. Finish with the shared acceptance audit, manual review checklist, and spec finalization contract. Architecture-bearing plans also require final zero-drift closure and an empty migration ledger.
14. Invoke `$show-me` to present the implementation notes, final code changes,
    acceptance status, and manual review path from finalized
    `IMPLEMENTATION-NOTES.md`, the diff, and recorded evidence. The presentation
    does not replace evidence and cannot satisfy or change an acceptance result.

## Branch and PR invariant

Read [references/lifecycle.md](references/lifecycle.md) before implementation for
recorded branch/base authority, existing PR identity and early draft visibility.
Workers write on that recorded branch under exclusive Active Write Scopes.

## Advanced features

- Shared lifecycle, notes contract, tech-debt rules, acceptance audit, finalization: see [references/lifecycle.md](references/lifecycle.md)
- UI before/after screenshot evidence and PR handoff links: see [references/ui-screenshot-evidence.md](references/ui-screenshot-evidence.md)
- Supported-runtime proof and cleanup contract: see [references/runtime-product-validation.md](references/runtime-product-validation.md)
- Scoped execution: see [references/parallel.md](references/parallel.md)
- Plan parsing, Task Gates and frontier release: see [references/parallel-orchestration.md](references/parallel-orchestration.md)
- Worker brief contract: see [references/parallel-worker-brief.md](references/parallel-worker-brief.md)
- Architecture-bearing wave checkpoints and final closure: see [references/architecture-conformance.md](references/architecture-conformance.md)
