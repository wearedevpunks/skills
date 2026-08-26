# Return Target Gate

## Entry guard

Every stage required by the chosen target depth has fresh accepted evidence and
matching exact provider readback.

## Inputs

Target depth, exact Fog and child identities, immutable resolution pointers,
provider readbacks, and unresolved accepted resulting scope.

## Bounded action

Assemble the direct-composition return shape. State the depth reached, accepted
evidence, enriched or produced provider objects, and the next explicit human
option. Preserve remaining scope and production-evidence obligations.

## Invariants

This gate never marks the Fog complete. Business returns exactly one Business
child; Functional returns one or more Functional children selected for this
invocation; Technical returns exactly one Technical child per selected Story.
Every returned child includes its accepted projection readback.

## Completion evidence

All required stage identities, immutable pointers, exact readbacks, and a
runtime handoff whose outcome is `target_depth_reached` rather than Fog
completion.

## Declared exits

- `target_depth_reached` -> return control to the invoking human wrapper.
- `blocked` -> router re-entry when required evidence is incomplete.

## Durable handoff

Persist the returned identities, target depth, remaining accepted scope,
production-evidence obligations, and exact return outcome.
