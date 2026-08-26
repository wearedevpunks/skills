# Write Backlog Mutation Envelope

## Public Seam

`write-backlog` accepts one semantic operation and returns its exact provider
result. Callers do not select provider primitives or perform writes.

Required input:

- operation: initialize/reconstruct, Fog or pre-resolution grilling-child
  ensure, Research/Prototype support-child ensure, Business projection,
  Functional projection, Technical projection, Normalization, delivery status,
  or issue reconciliation
- durable wiki identity for every intended object and stable provider identity
  for every known object
- immutable accepted evidence that authorizes a projection, Normalization, or
  delivery-status operation; Fog, grilling-shell, and support-child intake use
  exact parent identity, kind, durable wiki identity, and cardinality instead
- proposed semantic delta, source wording, source links, and expected current
  provider state
- exact `V*` milestone for each Story and any explicit Fog target iteration
- structural approval record when the delta crosses an approval boundary

Missing operation-specific authority or conflicting authority returns every gap
with zero provider mutations. Intake requires no accepted evidence: it creates
or resumes the unresolved shell that will later carry that evidence.

## Topology

```text
Product/Backlog Root
└── Product Area
    └── Initiative
        └── Epic
            └── Story [exactly one contextual V*]
                └── Task 1..n [same V* + blocker relations]

Fog ──lateral provenance/enrichment──> Product Area | Initiative | Epic | Story | Task
```

Product Areas are durable product responsibilities. Initiatives are business
goals. Epics are long-lived business slices and may span iterations. Stories
are shippable product outcomes. Tasks are required atomic, independently
ownable delivery units.

Business projection creates or enriches Product Area, Initiative, and Epic.
Functional projection creates Stories. Technical projection creates mandatory
Tasks only after one authoritative agent-ready `SPEC.md` exists for the Story.
Fog remains lateral provenance throughout all three stages.

Every Story belongs to exactly one contextual `V*` milestone iteration, and
every Task belongs to the same iteration as its Story. A Fog may target one
fitting iteration. Product Areas, Initiatives, and Epics span iterations.

## Validation Envelope

Before the first provider write:

1. Resolve destination, Product/Backlog Root, repository, wiki, and provider
   workspace identity.
2. Read every target and relation from the provider.
3. Apply the exact create/enrich/stop decision table from
   [issue reconciliation](references/issue-reconciliation.md). A title is
   discovery evidence only.
4. Reuse the exact existing structure and fitting `V*` milestone. Propose a new
   structure only when no exact or fitting one exists.
5. Validate hierarchy, metadata representation, provider membership, source
   links, accepted evidence, and approval state.
6. For Technical projection, validate every parent Story and the complete
   reachable Task graph. Reject a missing parent Story, Task/Story milestone
   mismatch, missing blocker target, self-edge, future-iteration dependency, or
   cycle. Real blockers may cross Stories and Epics.
7. Preview material topology changes with `$show-me`; wait for explicit approval
   where required.

## Result Envelope

Return:

- provider and Product/Backlog Root identities
- operation and immutable evidence identity
- each durable wiki identity and stable provider ID/URL
- created, enriched, repaired, or unchanged classification
- exact parents, relations, `V*` membership, fields, views, source links, and
  statuses read back from the provider
- applied approval record and unresolved delta
- partial writes and recovery point when a provider request fails

Only exact readback proves success. A successful request without matching
readback is an unresolved reconciliation, not completion.
