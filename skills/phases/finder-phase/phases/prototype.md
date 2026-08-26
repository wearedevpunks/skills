# Prototype Support Gate

## Entry guard

The active grilling child records one precise unknown requiring a human-evaluated
artifact and no fresh verdict exists.

## Inputs

Exact Fog, supported grilling child identity, precise question, prior Prototype
children, and retained verdict evidence.

## Bounded action

Reuse or semantically request one direct Fog Prototype child through
`$write-backlog`, linked to the grilling child it supports. Run
`$prototype-phase`. Accept only its human verdict plus immutable artifact and
verdict pointers, then route to reconciliation.

## Invariants

A Prototype verdict informs its named grilling child. It cannot independently
authorize backlog projection.

## Completion evidence

Stable Prototype child identity, supported-child relation, human verdict,
immutable artifact/verdict pointers, and exact child/relation readback.

## Declared exits

- `support_resolved` -> reconciliation then router re-entry.
- `iterate` -> remain in this gate after durable handoff.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing retained evidence.

## Durable handoff

Persist Prototype identity, supported child, verdict pointers, readback, and
exit.
