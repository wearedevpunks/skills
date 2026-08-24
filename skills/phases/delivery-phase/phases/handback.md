# Handback Phase

## Guard

The router selected current evidence that triggers `$handback`.

## Bounded Action

1. Invoke `$handback` with the active delivery evidence.
2. Persist its complete outcome as `human_steering_required` in the delivery
   handoff.
3. Stop.

## Completion Evidence

- the durable `$handback` outcome
- unchanged accepted bounds and in-bounds artifacts
- no expanded design, implementation, delegation, or review

## Exit

Return terminal `human_steering_required`. Resume routing only after the
`$handback` authority guard passes.
