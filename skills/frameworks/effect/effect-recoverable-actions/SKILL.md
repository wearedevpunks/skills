---
name: effect-recoverable-actions
description: |
  Apply Effect-specific recoverability guidance on top of backend-recoverable-actions.
  Use when an Effect backend flow chains dependent operations, especially DB writes
  plus external calls, and needs transaction, retry, rollback, compensation, or
  failure-path testing strategy. Do not use for simple single-step reads or writes.
---

# Effect Recoverable Actions

Use this skill with `$backend-recoverable-actions`, `$effect-backend-structure`, and `$effect-best-practices`.

The agnostic skill owns the recovery model:

- step classification
- transaction boundaries
- retry scope
- compensation and durable repair
- failure-path testing

This skill adds the Effect-specific primitives and testing expectations.

## Workflow

1. Identify the backend root from the current repo; do not assume a monorepo path.
2. Read the nearest relevant `AGENTS.md` files.
3. Read `$backend-recoverable-actions` plus its strategy and test matrices.
4. Run `effect-solutions show error-handling` and `effect-solutions show testing`.
5. Check local `opensrc` source when transaction, retry, accumulation, or control-flow behavior matters.
6. Enumerate the action steps in order.
7. Choose the failure strategy before writing code.
8. Add failure-path `@effect/vitest` tests before considering the action complete.

## Effect Hard Rules

- DB-only multi-write groups should use `SqlClient.withTransaction(...)`.
- Standardize on action-level transaction wrapping. Do not invent custom transaction plumbing in feature code.
- Treat nested transaction/savepoint behavior as background knowledge, not the default authoring model.
- Cross-system flows cannot pretend DB rollback will undo auth providers, email, queues, or other external writes.
- Retries must be explicit and step-local through `retry` or `retryOrElse`.
- Prefer `catchTag` / `catchTags` for selective recovery.
- Prefer `when`, `unless`, `match`, and `matchEffect` when the control-flow choice carries recovery meaning.
- Use `partition`, `validateAll`, or `Effect.all(..., { mode: ... })` only for preflight, batch validation, or deliberately parallel collection phases.
- Use typed yieldable errors with `Schema.TaggedError` for recoverable failures.
- `acquireUseRelease` and `ensuring` are cleanup/finalization primitives, not substitutes for business rollback.
- Do not teach `Effect.withExecutionPlan` as default recoverability guidance while it is experimental.

## References

- `references/source-backed-primitives.md` for exact Effect surfaces
- `references/strategy-matrix.md` for Effect-specific strategy examples
- `references/test-matrix.md` for Effect-specific test expectations
- `references/flow-examples.md` for generic Effect flow examples

## Output Checklist

- `$backend-recoverable-actions` was applied
- each step boundary has an explicit strategy
- DB-only multi-write groups use one transaction boundary
- cross-system steps have a compensation or durable repair story
- retries are narrow, explicit, and only for transient idempotent steps
- expected recoverable failures stay typed
- failure-path tests cover the chosen recovery model
- no silent partial-write risk remains undocumented
