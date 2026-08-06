# Write Backlog Gate

## Entry Guard

A valid retained agent-ready `SPEC.md`, immutable commit SHA, and verified stable URL exist, while a verified current provider projection matching that exact spec is missing.

## Inputs

- Authoritative retained `SPEC.md`, commit SHA, and verified stable URL.
- Provider configuration and current provider state.
- Existing projection evidence and `REQUIREMENTS-HANDOFF.md`, used as corroboration only.

## Bounded Delegation

Activate `write-backlog` for provider validation and mutation. Reconcile its result by verifying the complete projected graph, provider identifiers and URLs, and immutable linkage to the exact retained spec before accepting completion.

## Invariants

- Provider mutation remains owned by `write-backlog` and begins only after its complete preflight passes.
- Projection preserves stable `US-###` and `AC-###` traceability to the retained spec.
- Evidence from another spec revision is stale for this gate.
- This gate owns validation and the runtime handoff; the delegated skill owns provider writes.

## Completion Evidence

- Provider readback proves every projected item exists in the intended scope.
- Projection evidence identifies provider items and URLs and links the exact retained spec SHA and stable URL.
- Validation proves the provider graph is current and internally consistent.

## Declared Exits

- `completed`: completion evidence passes; re-enter the router.
- `skip`: concurrent provider readback proves the matching projection already exists; record the no-op and re-enter the router.
- `blocked`: preflight, mutation, readback, or provider authority fails; record partial state and stop.

## Durable Handoff

Before every exit, update `<planning-surface>/REQUIREMENTS-HANDOFF.md` using [`../references/runtime-handoff.md`](../references/runtime-handoff.md). Record this as the current or last gate, retained spec identity, provider projection evidence, validation, blockers, and an advisory next route.

## Stop or Re-entry

Stop on `blocked`. After `completed` or `skip`, re-enter `router.md`; do not load a sibling gate directly.
