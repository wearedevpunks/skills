# Reconcile Stage Gate

## Entry guard

Fresh accepted stage or support evidence exists without matching exact provider
readback.

## Inputs

Exact Fog snapshot, child identity, immutable evidence, semantic projection or
support intent, prior provider identities, and current wiki/provider state.

## Bounded action

1. Verify the intent still matches current evidence and target depth.
2. Send the semantic intent to `$write-backlog`; that skill owns identity
   reconciliation, structural preview/approval, provider mutation, and readback.
3. Consume exact readback for every created or enriched object, relationship,
   source link, and stage field.
4. Link the Fog and stage child to every enriched or produced object through the
   writer result. Preserve Fog as lateral provenance.
5. If accepted evidence conflicts or identity is ambiguous, emit no further
   mutation intent and route to handback.

## Invariants

No provider mechanics live here. Title-only matching is inadmissible. A stage
cannot become accepted runtime state until immutable evidence and exact readback
agree.

## Completion evidence

Accepted child identity and resolution pointer, exact created-or-enriched
identities and relations, source links, stage fields, and provider snapshot.

## Declared exits

- `stage_reconciled` -> router re-entry.
- `support_reconciled` -> owning grilling gate through router re-entry.
- `approval_required` -> persist checkpoint and stop.
- `human_steering_required` -> handback.
- `blocked` -> stop with missing readback.

## Durable handoff

Persist intent identity, all exact readback identities and relations, provider
snapshot, checkpoint or blocker, and exit.
