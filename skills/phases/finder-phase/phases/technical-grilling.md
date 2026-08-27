# Technical Grilling Gate

## Entry guard

Target depth is Technical, Functional projection readback exists, and the
selected Story lacks valid Technical evidence.

## Inputs

Exact Fog, accepted Business and Functional evidence, one stable Story identity,
current Technical children, and wrapper presentation profile.

## Bounded action

1. Read every Technical-stage child for the selected Story. Resume reuses the
   exact child and its durable wiki/provider identities.
2. When none exists, allocate and persist one durable Technical grilling-child
   wiki identity. Authorize its child shell by the exact Fog identity, Stage
   `Technical`, and stable Story identity. Send that child-shell ensure intent
   to `$write-backlog` and require exact readback before technical grilling.
   This ensure does not require accepted grilling evidence. Ambiguity or
   duplicate child identity for the Story produces zero writes and routes to
   human steering.
3. Activate one full `$requirements-grill` on the ensured Technical child for
   this Story. The requirements authority owns technical decision closure.
4. Persist the immutable accepted resolution for that Technical child.
5. Invoke `$create-spec` with the Story identity and accepted Business,
   Functional, and Technical evidence.
6. Require a returned SPEC with `readiness: agent-ready` and a verified stable
   blob URL before continuing.
7. Derive a nonempty Task intent containing at least one atomic Task and its
   blocker relationships from that authoritative SPEC.
8. Only then emit one semantic technical projection intent to `$write-backlog`
   for exact Task and relation readback. Require its successful
   `validate-task-blocker-graph` result over the full reachable graph, resolved
   milestone order, and resulting provider snapshot.

## Invariants

This gate owns stage identity, ordering, and resume. The requirements authority
owns technical decisions, `$create-spec` owns compilation, and `$write-backlog`
owns provider mutation. `spec-not-ready` or missing verified stable blob returns
zero projection and zero target-depth return, then routes to human steering.
Empty Task intent does the same. Resume reuses the exact child; ambiguity or
duplicate identity produces zero writes and routes to human steering.

## Completion evidence

One exact Technical child for the Story, immutable accepted resolution pointer,
agent-ready SPEC, verified stable blob URL, nonempty Task intent, semantic
projection intent, exact Task/relation readback, and the successful
full-reachable Task graph validator result bound to that provider snapshot.

## Declared exits

- `technical_accepted` -> reconciliation.
- `support_required` -> Research or Prototype through router re-entry.
- `spec-not-ready` -> handback with zero projection.
- `task_intent_empty` -> handback with zero projection.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing evidence.

## Durable handoff

Persist Story and durable Technical child wiki/provider identities before the
grill, then the immutable resolution pointer, SPEC stable blob URL, readiness,
Task intent, support relations, projection/readback state, and exit.
