# Functional Grilling Gate

## Entry guard

Target depth includes Functional and accepted Business projection readback
exists, while one required Functional child is missing or invalid.

## Inputs

Exact Fog and Business evidence, resolved hierarchy identities, selected Story
intent, current Functional children, and wrapper presentation profile.

## Bounded action

1. Read every Functional-stage child matching the selected Story intent. Resume
   reuses the exact child and its durable wiki/provider identities.
2. When none exists, allocate and persist one durable Functional grilling-child
   wiki identity. Authorize its child shell by the exact Fog identity, Stage
   `Functional`, and stable Story-intent key. Send that child-shell ensure intent
   to `$write-backlog` and require exact readback before grilling. This ensure
   does not require accepted grilling evidence. Ambiguity or duplicate child
   identity for that Story intent produces zero writes and routes to human
   steering.
3. Activate atomic `$grilling` on the ensured Functional child using the
   wrapper's presentation profile.
4. Persist the immutable accepted resolution for that child. Only then emit one
   semantic Story projection intent for reconciliation.

## Invariants

One Functional child maps to one Story intent. Accepted Business scope is
reused. This gate neither requires implementation architecture nor writes a
provider. Creating the child shell does not require accepted grilling evidence.
Resume reuses the exact child; ambiguity or duplicate identity produces zero
writes and routes to human steering.

## Completion evidence

Stable Functional child identity, immutable accepted resolution pointer, and
semantic Story projection intent.

## Declared exits

- `functional_accepted` -> reconciliation.
- `support_required` -> Research or Prototype through router re-entry.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing evidence.

## Durable handoff

Persist the stable Story-intent key and durable child wiki/provider identities
before the grill, then the resolution pointer, support relations, projection
intent, and exit.
