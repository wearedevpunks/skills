# Grill

## Entry Guard

Enter only when the router selected this gate: intake evidence is fresh and
accepted constraints are missing or conflict with that evidence.

## Inputs

- the Design Target section and intake evidence summary
- existing requirements-grill status and log artifacts for this target, when
  present

## Actor-Like Gate Boundary

Grill owns the accepted-constraints record. It delegates the interview to
`requirements-grill`; the interview rounds belong to that skill and add no
design-phase checkpoint.

## Bounded Action

1. Activate `requirements-grill` from this gate only, as a lean grill over:
   goals, user-visible page or flow scope, constraints, conflicts with
   existing system evidence, hard requirements, content ownership, target
   surface, and non-negotiables.
2. Default to one branch per user-visible page or flow. Use a section-level
   branch only when the section is an independent decision surface.
3. Leave visual choices to the brand, compose, and variant gates; this grill
   closes the frame they work inside.
4. Prefer existing design-system evidence over new taste preferences.
5. Stop the grill when accepted constraints are clear enough for brand and
   composition work.

## Invariants

- Constraints are accepted only through `requirements-grill` closure.
- App code and design artifacts stay unchanged.

## Completion Evidence

- accepted constraints by scope unit
- rejected or superseded constraints
- open conflicts and parked scope, each with an owner
- the requirements-grill status artifact path

## Declared Exits

- `complete` `constraints_accepted`: every scope unit has accepted
  constraints.
- `blocked` `constraints_open`: an open conflict blocks brand or composition
  work; the record names it and its owner.
- `human_steering_required`: the grill surfaced a change to accepted
  requirements; the record names the decision needed.

## Durable Handoff

Write one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `constraints_accepted`, re-enter [`router.md`](router.md). On a blocked
or steering exit, stop.
