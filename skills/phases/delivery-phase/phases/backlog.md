# Backlog Phase

Use this phase after an agent-ready spec exists and before concrete planning.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Delegate

Activate `write-backlog` only when the verified post-spec projection is missing
or stale.

## Checks Before Delegating

- Require the authoritative `SPEC.md` at a verified stable blob URL.
- Inspect recorded projection evidence: immutable spec URL, provider
  destination, exact Epic and Story identities, provider Task IDs and URLs,
  same `V*`, native blocker edges, and observed provider state.
- If that evidence and provider state are current for the same spec, perform zero
  provider mutations and record a verified no-op.
- If missing or stale, activate `write-backlog` and preserve its readiness and
  zero-mutation-on-failure contract.

## Completion State

Record backlog projection evidence:

- immutable spec URL
- provider destination
- projected Epic, Story, and provider Task IDs and URLs
- same `V*` membership and native blocker edges
- verification result and observed state
- mutation or no-op outcome

Then re-enter `delivery-phase`; planning is next when projection evidence is
current.
