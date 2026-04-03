# Strategy Matrix

Use this table to choose the recovery model before writing code.

| Flow shape | Default strategy | Notes |
| --- | --- | --- |
| DB read + DB write + DB write | One `SqlClient.withTransaction(...)` around the action-local DB mutation group | Keep commit-path sequencing explicit. |
| DB write + DB write inside nested helpers | One outer `SqlClient.withTransaction(...)` | Effect SQL internals support nested savepoints; author code at the action boundary, not with manual savepoints. |
| DB + Better Auth mutation | Compensation or durable repair path | DB rollback does not undo Better Auth state. |
| DB + Better Auth + email | DB transaction only for local writes, then explicit compensation / repair for Better Auth, plus an explicit delivery policy for email | Do not imply a single rollback boundary across all three systems. |
| DB + email / queue / third-party side effect | Explicit commit boundary plus post-commit recovery story | Decide whether the side effect is best-effort, compensatable, or must create repairable operator state. |
| Preflight validation over many items | `validateAll`, `partition`, or `Effect.all(..., { mode: "validate" | "either" })` | Use before the commit path, not during it. |
| Parallel validation or read-only fan-out | `Effect.all` with explicit concurrency, optionally `parallelErrors` | Be explicit about whether you want short-circuiting, `either`, `validate`, or collected parallel errors. |
| Commit path orchestration | Sequential by default | Introduce concurrency only when the failure semantics stay safe and obvious. |

## Classification guide

- `preflight`
  Validation, lookups, and checks that can fail before any durable mutation starts.
- `transactional-db`
  DB writes that must commit or roll back together.
- `retryable transient integration`
  External call with explicit transient failure handling and safe retry semantics.
- `compensation-required external`
  External write that cannot be covered by DB rollback.
- `post-commit follow-up`
  Side effect that happens after the main durable state transition and therefore needs an explicit repair story if it fails.

## Approval heuristics

- If all durable mutations are in the same DB boundary, use one transaction.
- If any step mutates external state, write down the compensation or repair story before implementation.
- If a retry changes business semantics or risks duplicates, do not retry the whole pipeline.
- If a collection helper hides which steps are concurrent or fail-fast, prefer explicit sequential composition in the commit path.
