# Handback Phase

## Guard

The router selected current evidence that triggers `$handback`.

## Bounded Action

1. Invoke `$handback` with the active delivery evidence.
2. Retain its complete outcome in the durable state artifact; put its Context
   Pointer and exact blocker in the compact Delivery Handoff.
3. Stop.

## Completion Evidence

- the durable `$handback` outcome
- unchanged accepted bounds and in-bounds artifacts
- no expanded design, implementation, delegation, or review

## Exit

Return terminal `human_steering_required`. Resume routing only after the
`$handback` authority guard passes.

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to this completion evidence. Stop in every mode until the
`$handback` authority guard passes.
