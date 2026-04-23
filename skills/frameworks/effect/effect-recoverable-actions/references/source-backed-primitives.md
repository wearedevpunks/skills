# Source-Backed Primitives

This repo ships the following recoverability primitives in local `opensrc` source.

## Transactions

- `@effect/sql` exposes `SqlClient.withTransaction(...)`.
- `SqlClient.withTransaction(...)` widens the error channel with `SqlError`.
- The internal SQL client implementation uses begin / commit / rollback and nested savepoints through `TransactionConnection`.
- The `sql-drizzle` tests show Drizzle queries participate in the transaction and roll back on failure.
- Those guarantees apply to work that stays inside the transaction-aware Effect/SQL context. Work escaped into plain promises or remote callbacks needs separate care.

Implication for this repo:

- teach action-level transaction wrapping
- do not teach manual savepoint orchestration as the primary authoring model
- remember that transaction wrappers can change the action error type

## Yieldable typed errors

- `Cause.YieldableError` is explicitly yieldable in `Effect.gen`.
- `Schema.TaggedError` extends a yieldable error base.

Implication for this repo:

- recoverable action-flow failures should stay typed
- typed yieldable errors are valid directly inside generator flows

## Recovery operators

These are present in `Effect` source and are fair game for this skill:

- `catchTag`
- `catchTags`
- `retry`
- `retryOrElse`

Implication for this repo:

- prefer selective typed recovery over generic `catchAll`
- keep retries narrow and explicit

## Control flow

These are present in `Effect` source:

- `when`
- `unless`
- `match`
- `matchEffect`

Implication for this repo:

- use them when the control-flow choice carries recovery meaning
- keep commit-path sequencing obvious

## Error accumulation and parallel behavior

These are present in `Effect` source:

- `partition`
- `validateAll`
- `Effect.all` with default / `either` / `validate` modes
- `parallelErrors`

Important source-backed semantics:

- `Effect.all` short-circuits by default
- `Effect.all(..., { mode: "either" })` runs all effects and returns `Either` results
- `Effect.all(..., { mode: "validate" })` runs all effects and returns accumulated `Option` failures
- `validateAll` accumulates failures but loses successes if any failures exist
- `partition` keeps both failures and successes

Practical choice in this repo:

- use `validateAll` when you want "all successes or the full set of failures" in a preflight phase
- use `partition` when you need successes and failures kept separately
- use `Effect.all(..., { mode: "either" | "validate" })` when the work is naturally concurrent and the per-branch result shape matters

Implication for this repo:

- use these in preflight, batch validation, or deliberate parallel collection phases
- do not hide commit-path mutation semantics behind them

## Cleanup vs rollback

These are present in `Effect` source:

- `acquireUseRelease`
- `ensuring`

Implication for this repo:

- they are cleanup/finalization primitives
- they are not automatic business rollback or compensation

## Adjacent but out of scope

- `Effect.withExecutionPlan` exists, but source marks it experimental

Implication for this repo:

- mention only as adjacent background
- do not teach it as the default project recoverability model in v1
