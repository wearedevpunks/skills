# Backlog Model

## Canonical Topology

```text
Product/Backlog Root
└── Product Area
    └── Initiative
        └── Epic
            └── Story [exactly one contextual V*]
                └── Task 1..n [same V* + blocker relations]

Fog ──lateral provenance/enrichment──> Product Area | Initiative | Epic | Story | Task
```

- Product Area: stable product responsibility.
- Initiative: business goal within one Product Area.
- Epic: long-lived business slice within one Initiative.
- Story: one shippable product outcome within one Epic.
- Task: required atomic, owner-ready Story work.
- Fog: external intake, evidence, decision history, and delivery provenance.

## Staged Projection

- Business grilling may reuse, enrich, or create the resolved Product Area,
  Initiative, and Epic path.
- Functional grilling creates exactly one Story per accepted Functional child.
- Technical grilling requires an authoritative agent-ready Story `SPEC.md`, then
  creates one or more mandatory Tasks and native blocker relations.

Every stage preserves its immutable resolution pointer and the exact provider
objects it enriched or produced. Fog is lateral provenance; it is not another
ownership level and does not replace native parent relations.

## Iterations And Blockers

Every Story belongs to exactly one contextual `V*` milestone iteration. Every Task belongs to the same iteration as its Story. A Fog may target a fitting
iteration. Product Areas, Initiatives, and Epics span iterations.

Reuse a fitting existing milestone before proposing another. Moving work to a
different iteration requires explicit approval. Milestones do not encode Task
precedence.

Validate the complete reachable Task graph before mutation:

1. Resolve every blocker target by stable identity.
2. Reject missing targets and self-edges.
3. Reject a dependency on a future `V*` milestone iteration.
4. Reject cycles across all reachable Tasks.
5. Preserve real blockers across Stories and Epics.

## Mutation Boundary

Construct and validate the full intended provider delta before the first write.
An identity, hierarchy, milestone, relation, representation, or approval
failure produces zero provider mutations. After writing, exact provider
readback must prove every intended object and relation.

Provider writes may fail between requests. Return all observed provider IDs and
the unresolved delta; never claim transactional atomicity.
