# Technical Projection

Before any provider write, require one exact Story, one immutable accepted Technical grilling
resolution on its exact child, and a verified stable blob URL to an authoritative agent-ready `SPEC.md`. The specification
must preserve stable user stories, acceptance criteria, accepted technical and
testing decisions, and verification seams. Name every readiness gap and write
nothing when authority is incomplete.

## Authority Enrichment

Read the exact existing Epic and Story before mutation. Enrich the existing Epic and Story with verified immutable spec authority: the stable blob URL, accepted
technical and testing decisions, verification seams, and Fog/Technical-resolution
provenance. Preserve their Business and Functional wording, non-goals,
dependencies, and durable accepted-artifact links.

Include this enrichment in the validated mutation before Task creation. When the
provider requires multiple requests, write and read back the authority enrichment
before creating Tasks. Missing or ambiguous Epic/Story identity, unsupported
immutable authority representation, or mismatched readback produces no Task write.

## Task Split

Create one or more mandatory, atomic, independently owner-ready Tasks for the
Story. Each Task must define one bounded shippable responsibility, preserve its
Story and specification authority, name its acceptance and verification
evidence, and remain understandable without a private planning artifact.

Tasks are the provider execution graph that downstream planning preserves. Do
not create a second private Task graph or split by technical layer when one
owner-ready vertical unit can deliver the result.

## Milestone And Blockers

Every Task uses the same `V*` milestone iteration as its Story. Resolve every
blocker by stable provider identity and validate the full reachable Task graph,
including existing connected Tasks.

Run the [provider-neutral Task graph
validator](../scripts/validate-task-blocker-graph.mjs) with every reachable
Story's stable identity and exact milestone, every reachable Task's stable
identity, parent Story identity, exact milestone, and blocker identities, plus
the resolved earliest-to-latest milestone order. A failed result authorizes
zero provider mutations. Provider adapters materialize only the validator's
accepted edges.

Reject:

- missing targets
- missing parent Stories
- Task/Story milestone mismatches
- future-iteration dependencies
- self-edges
- cycles

Real blockers may cross Stories and Epics when the target is in the same or an
earlier milestone iteration. Native blocker relations, not list order or
milestone order, define precedence and parallel delivery waves.

## Write And Read Back

Preview the complete Task topology with `$show-me`; obtain approval for any
structural movement. Write the validated Epic/Story authority enrichment, Tasks,
parents, the same `V*` membership, blockers, source links, and Fog provenance.
Read every enrichment and relation back exactly. Return stable Epic, Story, and
Task identities plus blocker edges to Finder, planning, and delivery consumers.
