# Ensure Fog Gate

## Entry guard

Target depth is valid and no exact Fog readback exists.

## Inputs

Request, repository/wiki identity, optional stable Fog identity, fresh provider
search, and current runtime handoff.

## Bounded action

1. If an identity was supplied, read that exact Fog, direct children,
   relations, resolution pointers, and provider objects.
2. Otherwise allocate one durable wiki Fog identity, persist it once, and search
   by that identity before proposing a create.
3. On zero exact matches, send one semantic Fog upsert intent with the durable
   wiki identity to `$write-backlog`; consume its exact readback.
4. On one exact match, resume it. On ambiguity or conflicting identity, emit no
   mutation intent and route to human steering.

## Invariants

Exactly one Fog is in scope. The Fog remains lateral provenance. This gate
contains no provider mechanics and never creates a grilling child.

## Completion evidence

One durable wiki identity, zero or one stable provider identity before the
write, exactly one provider Fog read back afterward, plus its current child and
relation snapshot.

## Declared exits

- `fog_ready` -> router re-entry.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing provider/wiki evidence.

## Durable handoff

Persist both Fog identities, readback identity, snapshot, exit, and evidence
freshness under the durable wiki Fog identity.
