# Human Steering Gate

## Entry guard

Fog identity, immutable lens, child relevance, support relation, evidence,
scope, or projection ceiling is ambiguous or conflicting under current
authority.

## Bounded action

Invoke `$handback` with the exact conflict and minimum human decision. Persist
its complete outcome as `human_steering_required`, prove that no mutation intent
was emitted after detecting the conflict, and stop.

## Completion evidence

Durable `$handback` outcome, exact missing authority or decision, and zero-write
proof.

## Declared exits

- `human_steering_required` -> terminal non-success state.
- `authority_guard_passed` -> router re-entry with the new human decision.

## Durable handoff

Persist conflict evidence, minimum required decision, complete `$handback`
outcome, and terminal state. The router keeps returning this terminal while the
authority guard remains unsatisfied.
