# Issue Reconciliation

## Read Before Write

Require one durable wiki identity and any known stable provider identity. Search
the complete verified destination for the expected object type, durable identity,
source links, and provider identity. Then apply exactly one outcome:

- **Exact create**: zero stable matches plus one durable wiki identity after a
  complete provider search and no unresolved adoption candidate authorizes exact
  create when the semantic branch permits a new object.
- **Enrich**: exactly one stable provider match carrying the same durable wiki
  identity authorizes enrich or unchanged classification after its current state
  is read.
- **Stop**: ambiguous identity, conflicting identity, or an incomplete provider search
  authorizes zero provider mutations.

For an enrich candidate, read the exact object, expected parent, relations,
milestone, fields, status, owner, source links, and provider revision. Compare
that fresh state with accepted intent.

Title-only matching is discovery evidence. Show all candidates and return the
missing identity or decision.

## Inherited-Object Adoption

Use adoption when an inherited provider object has a stable provider ID and the
intended durable wiki identity, but the provider object does not yet carry that
wiki binding. Adoption runs before exact-create classification.

1. Perform a full provider candidate read by stable provider ID: type, title,
   body, parent, children, relations, milestone, source links, and current
   provenance.
2. Make an exact topology and provenance comparison against the durable wiki
   object and intended Product/Backlog Root path.
3. Use `$show-me` to present the candidate, comparison, and proposed binding.
4. Require explicit human approval to bind the durable wiki identity.
5. Bind the durable wiki identity to that existing provider object through the
   supported provider representation, then perform exact readback of the binding,
   stable provider ID, topology, and provenance.

Ambiguous identity or conflicting candidates produce zero writes. Never use
title-only similarity for automatic adoption. A topology or provenance mismatch
remains a structural decision; adoption cannot silently reparent, merge, rename,
or change scope. After successful binding, rerun the normal decision table to
classify any additional enrichment.

Classify the intended delta:

- unchanged: exact provider state already matches
- create: complete search proves no stable match and the branch authorizes one
  exact object with the durable wiki identity
- additive: an unambiguous source or provenance link is missing
- stale repair: an exact object has an unambiguous stale operational field
- structural: boundary, goal, parent, roadmap commitment, duplicate closure,
  merge, split, reparenting, milestone movement, or reorganization changes
- conflicting: durable semantic authorities disagree

Additive and stale repairs may proceed after complete preflight. Structural
changes require `$show-me` preview and explicit approval. Conflicting meaning
requires a new decision persisted in its durable source before another attempt.

## Partial Failure Recovery

When a provider request fails after any write, stop. Read back every intended
object and relation, record the observed partial delta, and return stable IDs
plus the first unresolved operation. On resume, repeat read-before-write and
apply only the still-missing validated delta. Never replay the original batch
blindly or claim transactional atomicity.

## Exact Readback

Success requires exact readback of identity, hierarchy, membership, milestone,
blockers, semantic fields, provenance, source links, views, and status for the
selected branch. A mismatch is unresolved reconciliation and returns control
without reporting completion.
