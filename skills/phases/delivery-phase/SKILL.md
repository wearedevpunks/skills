---
name: delivery-phase
description: Routes a scoped delivery goal to the next lifecycle phase from current artifacts and evidence. Use when delivering, resuming, or closing a goal that may pass through spec, plan, implementation, review, debugging, docs ingest, and closeout.
---

# Delivery Phase

## Quick Start

`delivery-phase` is a reusable phase router.

1. Read [phases/router.md](phases/router.md).
2. Inspect only enough issue, spec, plan, notes, diff, review, validation, and docs state to choose the current gate.
3. Load exactly one phase file from `phases/`.
4. Complete that phase, write the phase outcome, then stop or re-enter `delivery-phase` to route again.

Completion of one phase does not imply loading the rest of the chain.

## Entry Modes

- **Full delivery:** user asks to deliver a bounded goal end to end.
- **Resume:** user returns after manual spec, plan, implementation, review, debugging, or docs work.
- **HITL checkpoint:** user wants one phase handled, then a stop for discussion or approval.
- **Closeout:** user asks to finish evidence, docs, stack, tracker, or PR state after the work is already done.

## Phase Files

- [phases/router.md](phases/router.md): choose the next phase from artifacts and evidence.
- [phases/spec.md](phases/spec.md): create or repair the reviewed spec.
- [phases/plan.md](phases/plan.md): create or repair the execution-ready plan.
- [phases/implement.md](phases/implement.md): execute the accepted plan.
- [phases/review.md](phases/review.md): run mandatory review and classify findings.
- [phases/debug.md](phases/debug.md): investigate runtime-evidence failures.
- [phases/docs-ingest.md](phases/docs-ingest.md): ingest docs-affecting changes or record a no-op.
- [phases/closeout.md](phases/closeout.md): finish stack, tracker, PR, validation, and final report state.

## Router Rules

- Do not read phase files other than `router.md` until the router selects them.
- Do not activate child skills at delivery start.
- Reuse fresh matching artifacts before loading creation skills.
- A phase may delegate to `create-spec`, `create-plan`, `implement-spec`, `review-phase`, `debugging-phase`, `docs-ingest-phase`, or `stack` only from its own phase file.
- After a phase completes, write enough state for future resume. See [references/phase-handoff.md](references/phase-handoff.md).

## Stop Conditions

- Selected phase completed and resumable state was written.
- User requested a HITL checkpoint before the next phase.
- Router reaches closeout and final evidence is reported.
- Scope is ambiguous, stale, contradictory, or blocked by missing access.
