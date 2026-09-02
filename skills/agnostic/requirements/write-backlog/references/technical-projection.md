# Delivery Projection

Before any provider write, require a verified stable blob URL for the
authoritative agent-ready `SPEC.md`. The specification must preserve neutral
`OUT-###` outcomes, acceptance criteria, accepted technical and testing
decisions, and verification seams. Name every readiness gap and write nothing
when authority is incomplete, mutable, or local-only.

## Derive Delivery Structure

Read current provider evidence and the immutable specification before mutation.
Derive or reuse the accepted Epic, then derive the shippable Stories and atomic,
independently owner-ready Tasks supported by the requirements. Missing or
ambiguous placement identity, unsupported immutable authority representation,
or mismatched readback authorizes zero provider writes.

Retain each `OUT-###` only as traceability from derived delivery items back to
the specification. It does not select a provider identity and never prescribes
an Epic, Story, or Task count. Outcome and Story counts may differ.

## Authority Enrichment

Enrich every reused or derived Epic, Story, and Task with the verified stable
specification authority: stable blob URL, applicable outcome links, acceptance
criteria, accepted technical and testing decisions, verification seams, and
durable provenance. Preserve accepted wording, non-goals, and dependencies.

Include authority enrichment in the validated mutation. When a provider
requires multiple requests, write and read back the authority enrichment before
creating dependent items. Any mismatched readback stops the remaining writes.

## Story and Task Split

Each derived Story is one shippable product outcome. Create one or more
mandatory Tasks only when required to deliver that Story. Every Task is atomic,
independently ownable, understandable from its Story and stable specification
authority, and names its acceptance and verification evidence.

Provider Tasks form the execution graph that downstream planning preserves. Do
not create a second private Task graph or split by technical layer when one
owner-ready vertical unit can deliver the result.

## Milestone and Blockers

Every Task uses the same `V*` milestone iteration as its Story. Resolve every
blocker by stable provider identity and validate the full reachable Task graph,
including existing connected Tasks.

Run the [provider-neutral Task graph
validator](../scripts/validate-task-blocker-graph.mjs) with every reachable
Story's stable identity and exact milestone; every reachable Task's stable
identity, parent Story identity, exact milestone, and blocker identities; plus
resolved earliest-to-latest milestone order. A failed result authorizes zero
provider mutations. Provider adapters materialize only accepted edges.

Reject missing targets, missing parent Stories, Task/Story milestone mismatch,
future-iteration dependencies, self-edges, and cycles. Real blockers may cross
Stories and Epics when their target is in the same or an earlier milestone.
Native blocker relations, rather than list or milestone order, define delivery
precedence.

## Write and Read Back

Preview the complete authority-derived topology with `$show-me`; obtain
approval for material structural movement. Write only the validated Epic,
Stories, Tasks, parents, `V*` membership, blockers, source links, and provenance.
Read every identity, enrichment, and relation back exactly. Return the stable
Epic, Story, and Task identities plus blocker edges to planning and delivery
consumers.
