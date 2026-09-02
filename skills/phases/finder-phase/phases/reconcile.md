# Optional Projection Reconciliation Gate

## Entry guard

Fresh bounded intake evidence contains an optional semantic structure intent
without a final exact readback.

## Bounded action

No provider mechanics live here.

1. Verify the intent still matches current evidence and the invoking wrapper's
   projection ceiling.
2. Send the semantic intent to `$write-backlog`, which owns identity
   reconciliation, preview and approval, provider mutation, and exact readback.
3. Consume exact identities, relationships, source links, and residual result.
4. On an unavailable or declined optional projection, record it unresolved and
   preserve the otherwise valid Fog result.
5. Conflicting identity or above-ceiling intent emits no mutation request and
   routes to human steering.

## Completion evidence

The original semantic intent plus exact optional structure readback, an
unresolved projection result, or a zero-write conflict result.

## Declared exits

- `projection_reconciled` -> router re-entry.
- `projection_unresolved` -> bounded return through router re-entry.
- `approval_required` -> persist checkpoint and stop.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing required readback.

## Durable handoff

Persist intent identity, wrapper ceiling, exact readback or unresolved result,
provider snapshot, checkpoint or blocker, and exit.
