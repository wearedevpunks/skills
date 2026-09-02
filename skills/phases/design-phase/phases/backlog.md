# Backlog Phase

Route approved design evidence into the accepted delivery scope.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Prerequisite

An authoritative agent-ready `SPEC.md` with a verified stable blob URL links at
least one fresh approved artifact set and its artifact contract.

## Steps

1. Verify the specification authority, approved artifact links, durable asset
   links, accepted scope, constraints, and acceptance checks.
2. Decide whether the approved evidence fits the retained specification and
   its already accepted delivery items.
3. When the evidence requires new Stories or Tasks, retain the accepted design
   evidence and return it to Requirements Phase. Requirements Phase closes the
   changed scope and alone authorizes a new delivery-depth projection.
4. When the evidence fits the accepted scope, use `repo-asset-management` for
   backlog attachments, with its repo-provider fallback when direct
   attachments are unavailable or unsuitable. Preserve the existing backlog
   identities.
5. Record the linked backlog identities and preserve the
   `spec -> backlog -> delivery` handoff.

## Rules

- `repo-asset-management` owns provider upload commands and attachment
  fallbacks.
- Record a durable fallback path or blocker when visual evidence cannot be
  attached.
- Unapproved scope returns to Requirements Phase before backlog mutation.

## Output

- Retained design evidence and approved artifact links.
- Existing backlog identities and URLs when scope is unchanged.
- Requirements Phase return when scope needs new Stories or Tasks.
- Attachment fallback blockers.
- Phase handoff next route: delivery-handoff.
