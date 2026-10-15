# Write Backlog Mutation Envelope

## Public Seam

`write-backlog` accepts one semantic operation and returns its exact provider
result. Callers neither select provider primitives nor perform writes.

Required input:

- operation: initialize/reconstruct, Fog/Grilling/support intake, Business
  projection, Functional projection, delivery projection, Normalization,
  delivery status, or issue reconciliation
- durable wiki identity for every intended object and stable provider identity
  for every known object
- immutable accepted evidence authorizing projection, Normalization, or a
  delivery-state operation; intake instead carries exact parent, kind, durable
  identity, and bounded unknown
- proposed semantic delta, source wording, immutable source links, and expected
  provider state
- exact `V*` milestone for every Story and derived Task

Missing, mutable, ambiguous, or conflicting authority returns every gap with
zero provider mutations.

## Semantic Topology

```text
Product/Backlog Root
└── Product Area
    └── Initiative
        └── Epic
            └── Story [exactly one contextual V*]
                └── Task [same V* + blocker relations when derived]

Fog ──lateral provenance/enrichment──> Product Area | Initiative | Epic | Story | Task
```

Product Areas are stable product responsibilities. Initiatives are business
goals. Epics are long-lived business slices. Stories are shippable product
outcomes. Derived Tasks are atomic, independently ownable delivery units.

Business projection stops at Product Area and Initiative. Functional projection
may project that structure plus Epics. Neither Finder projection creates Stories
or Tasks. Delivery projection starts from an immutable agent-ready `SPEC.md`,
treats `OUT-###` only as traceability, and derives or reuses the accepted Product
Area → Initiative → Epic → Story → Task placement. Outcome count imposes no
provider-item cardinality.

## Validation Envelope

Before the first provider write:

1. Prove Product/Backlog Root, repository, wiki, actual provider workspace, and
   authenticated user.
2. Read every target and relation from the provider.
3. Apply the exact create/reuse/enrich/stop decision table from
   [issue reconciliation](references/issue-reconciliation.md). A title is only
   discovery evidence.
4. Reuse exact structure and fitting `V*` milestones. Preview material
   topology changes.
5. Validate hierarchy, adapter representation, memberships, immutable source
   links, accepted evidence, and historical-ticket exclusion.
6. Validate every parent Story and the complete reachable Task graph. Reject a
   missing parent or blocker, milestone mismatch, future-iteration edge,
   self-edge, duplicate edge, or cycle.
7. Validate a small mutation envelope: ordered operations, stable identities,
   preconditions, and the exact readback comparison expected after each write.

## Result Envelope

Return provider, workspace, Product/Backlog Root, and authenticated-user
identities; operation and immutable evidence identity; stable provider IDs and
durable wiki identities; created, enriched, repaired, or unchanged
classification; exact parents, relations, `V*` membership, assignees, semantic
fields, views, source links, and statuses;
structural changes; observed writes; recovery point; and residual delta.

Only exact readback proves success. A successful provider request with a
mismatched readback remains unresolved reconciliation.
