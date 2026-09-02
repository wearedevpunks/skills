# Backlog Model

## Canonical Topology

```text
Product/Backlog Root
└── Product Area
    └── Initiative
        └── Epic
            └── Story [exactly one contextual V*]
                └── Task [same V* + blocker relations when derived]

Fog ──lateral provenance/enrichment──> Product Area | Initiative | Epic | Story | Task
```

- Product Area: stable product responsibility.
- Initiative: business goal within one Product Area.
- Epic: long-lived business slice within one Initiative.
- Story: shippable product outcome within one Epic.
- Task: derived atomic, owner-ready Story work.
- Fog: intake, evidence, decision history, and delivery provenance.

## Projection Boundaries

- Business Finder may reuse, enrich, or create Product Areas and Initiatives;
  Initiative is its ceiling.
- Functional Finder may project that Business structure plus Epics; Epic is its
  ceiling. Neither Finder branch creates Stories or Tasks.
- Requirements Phase supplies an immutable agent-ready `SPEC.md` with neutral
  `OUT-###` outcomes. Write Backlog derives or reuses Product Area → Initiative
  → Epic → Story → Task placement and native blocker relations. Outcome identity
  remains traceability and imposes no Story or Task cardinality.

Every projection preserves immutable evidence and exact provider identities.
Fog is lateral provenance and does not replace native parent relations.

## Iterations and Blockers

Every Story belongs to exactly one contextual `V*` milestone. Every derived
Task belongs to its Story's milestone. Product Areas, Initiatives, and Epics may
span iterations.

Validate the complete reachable Task graph before mutation:

1. Resolve every parent Story and blocker target by stable identity.
2. Reject missing identities, duplicate edges, and self-edges.
3. Reject a dependency on a future `V*` milestone.
4. Reject cycles across all reachable Tasks.
5. Preserve real blockers across Stories and Epics.

## Mutation Boundary

Construct and validate the full intended provider delta before the first write.
An authority, identity, hierarchy, milestone, representation, or approval
failure produces zero provider mutations. After writing, exact readback must
prove every intended object and relation. A partial failure returns observed
provider IDs and the residual delta without claiming atomic success.
