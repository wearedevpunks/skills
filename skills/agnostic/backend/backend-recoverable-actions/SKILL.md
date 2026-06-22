---
name: backend-recoverable-actions
description: |
  Design recoverable backend action flows for multi-step mutations with explicit
  transaction, retry, rollback, compensation, and failure-path testing strategy.
  Use when backend work chains dependent writes, DB changes plus external side
  effects, durable repair flows, or review of partial-failure risk.
---

# Backend Recoverable Actions

Use this skill for chained multi-step backend mutations. Every mutating flow must be atomic or intentionally repairable.

Do not use this for simple single-step reads or writes.

Read `references/strategy-matrix.md` and `references/test-matrix.md` before implementation.

## Workflow

1. Enumerate the action steps in order.
2. Classify each step:
   - `preflight`
   - `transactional-local`
   - `retryable transient integration`
   - `compensation-required external`
   - `post-commit follow-up`
3. Choose the failure strategy before writing code.
4. Keep commit-path orchestration sequential unless concurrency semantics are explicit.
5. Add failure-path tests before considering the action complete.

## Hard Rules

- Local multi-write groups need one explicit transaction boundary when the storage layer supports transactions.
- Cross-system flows cannot pretend local rollback will undo auth providers, email, queues, billing, or other external writes.
- Retries must be explicit and step-local.
- Never retry an entire non-idempotent mutation pipeline by default.
- External writes need compensation, durable repair state, or a documented best-effort policy.
- Cleanup/finalization is not the same as business rollback.
- Parallel validation is allowed before commit; parallel mutation needs explicit failure semantics.

## Output Checklist

- each step boundary has an explicit strategy
- local multi-write groups have one transaction boundary
- cross-system steps have a compensation or durable repair story
- retries are narrow, explicit, and only for transient idempotent steps
- expected recoverable failures stay typed or structured
- failure-path tests cover the chosen recovery model
- no silent partial-write risk remains undocumented
