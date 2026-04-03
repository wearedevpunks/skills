---
name: effect-recoverable-actions
description: Build or refactor recoverable multi-step Effect action flows in a backend workspace/app. Use when a task chains multiple dependent operations, especially DB writes plus external calls, and explicitly needs a transaction, retry, rollback, compensation, or failure-path testing strategy. Do not use for simple single-step reads or writes.
---

# Effect Recoverable Actions

Use this skill for chained multi-step backend action flows with multiple dependent operations. Every mutating flow must be atomic or intentionally repairable.

Load this alongside `effect-backend-structure` and `effect-best-practices`. It does not replace them.

## When to use

Use this skill when the task involves any of:

- multiple writes in one action
- DB writes plus Better Auth or another external side effect
- retry / fallback decisions around a mutating flow
- rollback, compensation, or durable repair design
- failure-path tests for orchestrated actions
- review of whether a multi-step action flow is recoverable

Do not use this skill for:

- simple single-step reads
- simple single-step writes
- router-only changes
- generic Effect code with no multi-step action orchestration

Treat any workspace-local instructions for the target backend as the routing summary. Treat this skill as the detailed implementation guidance for recoverable action flows.

## Workflow

1. Read any workspace-local instructions for the target backend package/app if they exist.
2. Run `effect-solutions show error-handling` and `effect-solutions show testing`.
3. Check local `opensrc` source when transaction, retry, accumulation, or control-flow behavior matters:
   - `opensrc/repos/github.com/Effect-TS/effect/packages/effect`
   - `opensrc/repos/github.com/Effect-TS/effect/packages/sql`
   - `opensrc/repos/github.com/Effect-TS/effect/packages/sql-drizzle`
4. Enumerate the action steps in order.
5. Classify each step as one of:
   - `preflight`
   - `transactional-db`
   - `retryable transient integration`
   - `compensation-required external`
   - `post-commit follow-up`
6. Choose the failure strategy before writing code.
7. Add failure-path tests before considering the action complete.

Read [references/strategy-matrix.md](references/strategy-matrix.md) for the approved flow shapes.
Read [references/source-backed-primitives.md](references/source-backed-primitives.md) when you need the exact Effect surface.
Read [references/repo-cases.md](references/repo-cases.md) for representative examples.
Read [references/test-matrix.md](references/test-matrix.md) when designing tests.

## Hard rules

- DB-only multi-write groups must use `SqlClient.withTransaction(...)`.
- Standardize on action-level transaction wrapping. Do not invent custom transaction plumbing in feature code.
- Treat nested transaction/savepoint behavior as background knowledge, not as the default authoring model.
- Cross-system flows cannot pretend DB rollback will undo Better Auth, email, queues, or other external writes.
- Retries must be explicit and step-local through `retry` or `retryOrElse`.
- Never retry an entire non-idempotent mutation pipeline by default.
- Assume whole-flow retries can duplicate inserts, repeat external side effects, or both unless the flow has an explicit idempotency design.
- Prefer `catchTag` / `catchTags` for selective recovery.
- Prefer `when`, `unless`, `match`, and `matchEffect` over ad hoc nested branching when the control-flow choice is semantically important.
- Use `partition`, `validateAll`, or `Effect.all(..., { mode: ... })` only for preflight, batch validation, or deliberately parallel collection phases.
- Commit paths default to sequential orchestration. If you introduce concurrency, make the failure semantics explicit.
- Use typed yieldable errors with `Schema.TaggedError` for recoverable failures.
- `acquireUseRelease` and `ensuring` are cleanup/finalization primitives, not substitutes for business rollback.
- Do not recommend `Effect.withExecutionPlan` as default v1 recoverability guidance. It is experimental in current source.

## Output checklist

Before finishing, confirm:

- each step boundary has an explicit strategy
- DB-only multi-write groups use one transaction boundary
- cross-system steps have a compensation or durable repair story
- retries are narrow, explicit, and only for transient idempotent steps
- expected recoverable failures stay typed
- failure-path tests cover the chosen recovery model
- no silent partial-write risk remains undocumented
