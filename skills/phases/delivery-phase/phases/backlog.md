# Backlog Phase

Use this phase after an agent-ready spec exists and before concrete planning.

## Delegate

Activate `write-backlog` only when the verified post-spec projection is missing
or stale.

## Checks Before Delegating

- Require the authoritative `SPEC.md` at a verified stable blob URL.
- Inspect recorded projection evidence: immutable spec URL, provider destination,
  epic/story ids and URLs, and observed provider state.
- If that evidence and provider state are current for the same spec, perform zero
  provider mutations and record a verified no-op.
- If missing or stale, activate `write-backlog` and preserve its readiness and
  zero-mutation-on-failure contract.

## Completion State

Record backlog projection evidence:

- immutable spec URL
- provider destination
- projected epic/story ids and URLs
- verification result and observed state
- mutation or no-op outcome

Then re-enter `delivery-phase`; planning is next when projection evidence is
current.
