# Strategy Matrix

Use this table to choose the recovery model before writing code.

| Flow shape | Default strategy | Notes |
| --- | --- | --- |
| Local read + local write + local write | One transaction around the local mutation group | Keep commit-path sequencing explicit. |
| Local write + local write inside nested helpers | One outer transaction boundary | Helper internals should participate in the outer transaction when the stack supports it. |
| Local write + auth provider mutation | Compensation or durable repair path | Local rollback does not undo external auth state. |
| Local write + auth provider + email | Transaction only for local writes, explicit compensation or repair for auth, explicit delivery policy for email | Do not imply a single rollback boundary across systems. |
| Local write + email / queue / third-party side effect | Explicit commit boundary plus post-commit recovery story | Decide whether the side effect is best-effort, compensatable, or repairable. |
| Preflight validation over many items | Accumulate validation failures before mutation | Use before the commit path, not during it. |
| Parallel validation or read-only fan-out | Explicit concurrency plus explicit error aggregation semantics | Be clear about fail-fast vs collect-all behavior. |
| Commit path orchestration | Sequential by default | Introduce concurrency only when failure semantics stay safe and obvious. |

## Classification Guide

- `preflight`
  Validation, lookups, and checks that can fail before any durable mutation starts.
- `transactional-local`
  Local writes that must commit or roll back together.
- `retryable transient integration`
  External call with explicit transient failure handling and safe retry semantics.
- `compensation-required external`
  External write that cannot be covered by local rollback.
- `post-commit follow-up`
  Side effect that happens after the main durable state transition and therefore needs an explicit repair story if it fails.

## Approval Heuristics

- If all durable mutations are in the same transaction-capable store, use one transaction.
- If any step mutates external state, write down the compensation or repair story before implementation.
- If a retry changes business semantics or risks duplicates, do not retry the whole pipeline.
- If a collection helper hides which steps are concurrent or fail-fast, prefer explicit sequential composition in the commit path.
