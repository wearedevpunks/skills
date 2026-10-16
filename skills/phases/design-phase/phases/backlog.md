# Backlog

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Entry Guard

Enter only when the router selected this gate: a fresh promote commit and
approved artifact contract exist and backlog linkage is missing or stale.

## Inputs

- the promote commit SHA and the approved artifact contracts
- the Artifact Index with durable asset links or recorded upload blockers
- the resolved spec folder's `SPEC.md`, its readiness, and its verified
  stable blob URL
- the accepted delivery items of that specification

## Actor-Like Gate Boundary

Backlog routes approved design evidence into the accepted delivery scope. It
delegates attachments to `repo-asset-management`, which owns provider upload
commands and attachment fallbacks, and keeps scope fit and the handoff write.
Requirements Phase alone authorizes new delivery-depth projection.

## Bounded Action

1. Verify the prerequisite: an authoritative agent-ready `SPEC.md` with a
   verified stable blob URL links the fresh approved artifact contract. When
   it is missing, retain the design evidence and return it to Requirements
   Phase.
2. Verify the specification authority, approved artifact links, durable asset
   links, the promote commit, accepted scope, constraints, and acceptance
   checks.
3. Decide whether the approved evidence fits the retained specification and
   its already accepted delivery items.
4. When the evidence requires new Stories or Tasks, retain the accepted design
   evidence and return it to Requirements Phase. Requirements Phase closes the
   changed scope and alone authorizes a new delivery-depth projection.
5. When the evidence fits the accepted scope, use `repo-asset-management` for
   backlog attachments, with its repo-provider fallback when direct
   attachments are unavailable or unsuitable. Link the promote commit and the
   approved artifact contract to the existing backlog identities and preserve
   them.
6. Record the linked backlog identities and preserve the
   `spec -> backlog -> delivery` handoff.

## Invariants

- Unapproved scope returns to Requirements Phase before backlog mutation.
- Every visual attachment has a durable link or a recorded fallback path or
  blocker.

## Completion Evidence

- linked backlog identities and URLs with the promote commit, or the
  Requirements Phase return with its reason
- attachment links, fallback paths, or blockers

## Declared Exits

- `complete` `backlog_linked`: existing backlog identities link the promote
  commit and artifacts; next route `delivery-handoff`.
- `complete` `requirements_phase_return`: the scope needs new Stories or
  Tasks, or the specification prerequisite is missing; the design evidence is
  retained for Requirements Phase.
- `blocked` `attachment_blocked`: an attachment cannot become durable and no
  fallback applies; the record names the asset and the blocker.
- `human_steering_required`: the evidence contradicts the retained
  specification; the record names the decision needed.

## Durable Handoff

Write one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After a `complete` exit, re-enter [`router.md`](router.md). On a blocked or
steering exit, stop.
