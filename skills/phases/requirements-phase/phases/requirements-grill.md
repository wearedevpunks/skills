# Requirements Grill Gate

## Entry Guard

A material product decision is open or shared-understanding confirmation is missing, and the decision can be closed with current evidence. A concrete research or prototype need exits `finder-required` before delegation.

## Inputs

- Active planning surface and bounded goal.
- Latest grill status before its append-only log.
- Current research, prototype, and accepted decision evidence.
- Existing `REQUIREMENTS-HANDOFF.md`, used as corroboration only.

## Bounded Delegation

Activate `requirements-grill` for the human decision interview. Its scope is the open decision set. Reconcile its result by re-reading the durable grill artifacts and the operator's shared-understanding confirmation.

## Invariants

- The operator owns product decisions; recommendations remain evidence.
- Accepted, rejected, superseded, parked, and unresolved branches remain distinct.
- Research and prototype work returns to Finder with a precise missing-evidence statement.
- This gate owns validation and the runtime handoff; the delegated skill owns its interview artifacts.

## Completion Evidence

- Grill status and log identify every material branch.
- Every material decision is closed or explicitly parked.
- The operator's shared-understanding confirmation is recorded.

## Declared Exits

- `completed`: completion evidence passes; re-enter the router.
- `checkpoint`: a material decision awaits operator input; record the exact decision and stop.
- `finder-required`: research or prototype evidence is needed; record the precise need and stop for an explicit Finder handoff.
- `blocked`: required evidence or authority is unavailable; record the blocker and stop.

## Durable Handoff

Before every exit, update `<planning-surface>/REQUIREMENTS-HANDOFF.md` using [`../references/runtime-handoff.md`](../references/runtime-handoff.md). Record this as the current or last gate, link grill evidence, preserve validated downstream evidence, and make the next suggested route advisory.

## Stop or Re-entry

Stop on `checkpoint`, `finder-required`, or `blocked`. After `completed`, re-enter `router.md`; do not load a sibling gate directly.
