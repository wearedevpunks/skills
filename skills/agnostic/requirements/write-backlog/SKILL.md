---
name: write-backlog
description: Reconcile or materialize a coherent Linear or GitHub product backlog from accepted Finder, project-initialization, Normalization, planning, or delivery intent.
---

# Write Backlog

`write-backlog` is the sole physical provider mutation authority. Callers supply
semantic intent and evidence; this skill owns reconciliation, provider writes,
and readback. It preserves the user's ticket wording, canonical project terms,
source links, and durable traceability while structuring the ticket correctly.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Mutation Pipeline

1. Read [project context](references/project-context.md). Resolve
   `.devpunks/settings.json`, the Product/Backlog Root, project wiki,
   repository identity, and current provider workspace. Missing or legacy
   destination settings stop with exact `hi ensure` guidance; never discover or
   guess another destination.
2. Read project context, repository identity, and fresh provider state. Read
   every intended target, parent, relation, milestone, field, and view before
   deciding whether the operation creates, enriches, or repairs anything.
3. Read [the mutation envelope](REFERENCE.md) and
   [identity reconciliation](references/issue-reconciliation.md). After a
   complete provider search, create on zero stable matches, enrich one stable
   match carrying the same durable wiki identity, and stop on any ambiguity,
   conflict, or incomplete search.
4. Load exactly one semantic branch:
   - [initialize or reconstruct a backlog](references/backlog-initialization.md)
   - [ensure Fog or pre-resolution grilling child shell](references/fog-intake.md)
   - [project accepted Business grilling](references/business-projection.md)
   - [project accepted Functional grilling](references/functional-projection.md)
   - [project accepted Technical grilling from a verified stable blob URL](references/technical-projection.md)
   - [normalize existing backlog state](references/normalization.md)
   - [record directly observed delivery state](references/delivery-status.md)
5. Construct the complete intended mutation in memory. Validate authority,
   stable identity, hierarchy, provider representation, source links,
   contextual `V*` membership, and the full reachable Task blocker graph.
6. Use `$show-me` to preview the authority-derived topology. Boundary, goal,
   parent, roadmap, milestone movement, duplicate closure, merge, split,
   reparenting, or reorganization changes require explicit approval. The visual
   explains the proposal; it is not approval. Unambiguous additive links and
   stale-state repairs may continue after preflight.
7. Apply `$wait-what` when proposed ticket wording or project terms do not land.
   Re-pitch in the project's language; preserve accepted meaning and user
   wording instead of silently renaming it.
8. Select exactly one adapter from `backlogProvider`:
   - `Linear`: read [the Linear provider branch](references/providers/linear.md).
   - `GitHub`: read [the GitHub provider branch](references/providers/github.md).
   If exact hierarchy, metadata, milestone, relation, or readback representation
   is unavailable, stop with zero provider mutations and setup guidance.
9. Write only the approved, validated delta. Then perform exact readback of
   every intended identity, parent, relation, source link, field, view,
   milestone, status, and provider object. A partial provider failure returns
   the observed writes and unresolved delta; it never claims atomic success.
10. Return the stable provider IDs and URLs, durable wiki identities, branch,
    created/enriched/unchanged classification, approved structural decisions,
    exact readback, and any remaining blocker to the caller.

## Invariants

```text
Product/Backlog Root
└── Product Area
    └── Initiative
        └── Epic
            └── Story [one contextual V*]
                └── Task 1..n [required, same V* + blockers]

Fog ──provenance/enrichment──> Area | Initiative | Epic | Story | Task
```

- Business projection creates or enriches Product Area, Initiative, and Epic.
- Functional projection creates one Story per accepted Functional child.
- Technical projection requires an authoritative agent-ready `SPEC.md`, then
  creates one or more mandatory, atomic, owner-ready Tasks per Story.
- Every Story belongs to exactly one contextual `V*` milestone iteration. Each
  Task inherits the same iteration. Product Areas, Initiatives, and Epics span
  iterations. A Fog may target a fitting iteration.
- Reuse a fitting existing structure or milestone before proposing a new one.
- Blockers, not milestone order, define precedence. Reject missing targets,
  future-iteration edges, self-edges, and cycles across the complete reachable
  Task graph before any provider mutation.
- Fog is lateral provenance, not a delivery parent. Its accepted stage children
  and every enriched or produced provider object remain linked to it.
- Project views are Product Map, Roadmap, Fogs, and Current Delivery. This skill
  does not design CI/CD pipelines, sprints, provider Cycles, or scheduling.

## Body Contract

Every written ticket stays independently understandable and retains its source
authority. Add a compact `$show-me` visual when the relationships are harder to
understand than the prose. The visual does not replace product outcome,
`US-###`/`AC-###` traceability, immutable evidence, or provider-native
relations. Concrete files, commands, workers, and
execution notes stay in planning and delivery artifacts.

See [examples](EXAMPLES.md) for representative initialization and staged
projection results. Provider mechanics remain behind this mutation seam; Finder and delivery callers never perform provider writes themselves.
