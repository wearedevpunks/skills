# Human Steering Phase

## Guard

The next action exceeds accepted bounds, changes accepted requirements, weakens
a gate, substantially redesigns implementation, or requires missing authority.

## Bounded Action

1. Record the blocked action, supporting evidence, and exact decision needed in
   a durable state artifact.
2. Put its Context Pointer and exact blocker in the compact Delivery Handoff.
3. Return `human_steering_required` and stop.

## Completion Evidence

- durable decision record
- preserved accepted bounds and completed in-bounds artifacts
- expanded work awaits the required decision

## Exit

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to the decision record. In every mode, resume routing when current
user direction resolves the required decision.
