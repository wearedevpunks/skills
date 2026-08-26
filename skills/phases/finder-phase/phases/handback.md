# Human Steering Gate

## Entry guard

Identity, evidence, target depth, authority, or accepted scope is ambiguous or
conflicting and cannot be resolved from current authoritative evidence.

## Inputs

Exact conflict, admissible evidence, zero-write proof, current runtime handoff,
and the minimum human decision required.

## Bounded action

Invoke `$handback` with the conflict and minimum decision. Persist its complete
outcome as `human_steering_required` and stop.

## Invariants

No semantic mutation intent is emitted while the conflict remains. The router
keeps returning this terminal until the `$handback` authority guard passes.

## Completion evidence

Durable `$handback` outcome, exact missing authority or decision, and proof that
no mutation was requested after conflict detection.

## Declared exits

- `human_steering_required` -> terminal non-success state.
- `authority_guard_passed` -> router re-entry with the new human decision.

## Durable handoff

Persist the complete `$handback` outcome, conflict evidence, required decision,
and terminal state.
