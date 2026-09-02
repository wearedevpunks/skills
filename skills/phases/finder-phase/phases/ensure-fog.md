# Ensure Fog Gate

## Entry guard

The wrapper lens is valid and no exact Fog readback exists.

## Bounded action

1. If the caller supplied an identity, read the exact Fog, immutable intake
   lens, direct children, relations, and retained evidence.
2. Otherwise allocate one durable wiki Fog identity, persist it once, and search
   by that identity before proposing creation.
3. On zero exact matches, send one semantic Fog upsert intent with the wrapper's
   original intake lens to `$write-backlog`; require exact readback.
4. Resume one exact match. Route ambiguity or a conflicting lens to human
   steering with zero mutation intent.

## Completion evidence

One durable wiki Fog identity, optional exact provider Fog identity, exact
readback, provider snapshot, and immutable original Business or Functional
intake lens.

## Declared exits

- `fog_ready` -> router re-entry.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing evidence.

## Durable handoff

Persist both Fog identities, immutable lens, readback, snapshot, exit, and
freshness under the durable wiki Fog identity.
