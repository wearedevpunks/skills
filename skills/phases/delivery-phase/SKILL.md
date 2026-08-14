---
name: delivery-phase
description: Routes a scoped delivery goal to the next lifecycle phase from current artifacts and evidence. Use when delivering, resuming, or closing a goal that may pass through spec, plan, implementation, review, debugging, docs ingest, and closeout.
disable-model-invocation: true
---

# Delivery Phase

## Quick Start

`delivery-phase` is a reusable phase router.

1. Read [phases/router.md](phases/router.md).
2. Inspect only enough issue, spec, plan, notes, diff, retained review, durable
   handoff, validation, and docs state to choose the current gate.
3. If approved artifact links or UI Evidence links are present, carry them as routing evidence.
4. Load exactly one phase file from `phases/`.
5. Complete that phase and write its outcome. Full delivery re-enters routing immediately; other modes stop at their selected boundary.

Full delivery grants its selected inner steps the authority needed to reach closeout. Progressive loading still exposes one phase at a time.

## Entry Modes

- **Full delivery:** user asks to deliver a bounded goal end to end.
- **Resume:** user returns after manual spec, plan, implementation, review, debugging, or docs work.
- **HITL checkpoint:** user explicitly wants one phase handled, then a manual stop.
- **Closeout:** user asks to finish evidence, docs, stack, tracker, or PR state after the work is already done.

## Phase Files

- [phases/router.md](phases/router.md): choose the next phase from artifacts and evidence.
- [phases/spec.md](phases/spec.md): create or repair the agent-ready spec.
- [phases/backlog.md](phases/backlog.md): verify or project the agent-ready spec into delivery backlog items.
- [phases/plan.md](phases/plan.md): create or repair the execution-ready plan.
- [phases/implement.md](phases/implement.md): execute the accepted plan.
- [phases/review.md](phases/review.md): prepare the explicit review handoff or
  classify findings from a retained report.
- [phases/debug.md](phases/debug.md): investigate runtime-evidence failures.
- [phases/docs-ingest.md](phases/docs-ingest.md): ingest docs-affecting changes or record a no-op.
- [phases/closeout.md](phases/closeout.md): finish tracker, PR, validation, and final report state.

## Router Rules

- Do not read phase files other than `router.md` until the router selects them.
- Do not activate child skills at delivery start.
- Reuse fresh matching artifacts before loading creation skills.
- A phase may delegate to `create-spec`, `write-backlog`, `create-plan`,
  `implement-spec`, `debugging-phase`, or `docs-ingest-phase` only from
  its own phase file.
- In full delivery, activate `review-phase` as an authorized inner step below the three-pass budget. Outside full delivery, return its exact explicit invocation context and stop.
- After the third repair, run focused validation. Passing resumes routing toward closeout; terminal failure is a blocker.
- After a phase completes, write enough state for future resume. Review-triggered
  repair uses the idempotent fields in
  [references/phase-handoff.md](references/phase-handoff.md).

## Stop Conditions

- User explicitly requested a HITL checkpoint or one-phase mode and its resumable state was written.
- Router reaches closeout and final evidence is reported.
- Scope is ambiguous, stale, contradictory, or blocked by missing access.
