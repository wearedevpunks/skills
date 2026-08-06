# Create Spec Gate

## Entry Guard

Every material decision is closed or explicitly parked and shared understanding is confirmed, while a valid retained agent-ready `SPEC.md` is missing.

## Inputs

- Confirmed grill status and log.
- Current research and prototype evidence referenced by accepted decisions.
- Existing spec and retention evidence, if repair is required.
- Existing `REQUIREMENTS-HANDOFF.md`, used as corroboration only.

## Bounded Delegation

Activate `create-spec` as a no-interview compiler of confirmed decisions. Reconcile its atomic result by validating spec readiness, remote retention, the immutable commit SHA, and a stable blob URL that resolves to that SHA and path.

## Invariants

- The compiler introduces no product decision absent from confirmed evidence.
- One authoritative `SPEC.md` carries stable stories, acceptance criteria, traceability, and parked decisions.
- A local SHA and path alone do not establish retention.
- This gate owns validation and the runtime handoff; the delegated skill owns compilation and retention evidence.

## Completion Evidence

- `SPEC.md` declares `readiness: agent-ready` and passes the compiler's readiness checks.
- A retained remote ref contains the exact spec commit.
- The recorded stable blob URL resolves to the spec at that commit.

## Declared Exits

- `completed`: all completion evidence passes; re-enter the router.
- `finder-required`: compilation exposes a concrete research or prototype need; record it and stop for an explicit Finder handoff.
- `blocked`: the compiler returns `spec-not-ready`, retention fails, or required authority is unavailable; record the atomic failure and stop.

## Durable Handoff

Before every exit, update `<planning-surface>/REQUIREMENTS-HANDOFF.md` using [`../references/runtime-handoff.md`](../references/runtime-handoff.md). Record this as the current or last gate, the retained spec SHA and verified URL when valid, validation results, blockers, and an advisory next route.

## Stop or Re-entry

Stop on `finder-required` or `blocked`. After `completed`, re-enter `router.md`; do not load a sibling gate directly.
