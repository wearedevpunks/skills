# Write Backlog Reference

## Purpose

`write-backlog` is the provider-mutation adapter for three bounded branches: pre-spec decision intake, update-existing claim/release/resolution, and post-spec delivery projection. It does not compile specifications or create concrete implementation plans. Updating requires a provider id or URL, reads current state first, rejects conflicting claims, and writes the immutable resolution pointer supplied by Finder.

The direct backlog concepts are:

- `fog`
- `grilling`
- `research`
- `prototype`
- `epic`
- `story`

No shared cross-provider classification field is required. Every adapter must still make the direct concept visible and searchable through configured native representation or its documented nearest-native fallback. If neither preserves the concept, fail before mutation. Provider vocabulary does not become canonical domain vocabulary.

## Pre-spec intake contract

Finder may request one `fog`, `grilling`, `research`, or `prototype` item before
a spec exists. A `fog` item requires a frontier or uncertainty description; it
does not require a precise question. A `grilling`, `research`, or `prototype`
item requires the precise question derived when fog graduates. Every intake
also requires its selected classification, map link, dependencies, and claim
state. Validate the complete intake dependency graph for missing targets,
self-edges, and cycles before mutation. Materialize exactly that intake item;
do not infer or create delivery epics/stories.

## Delivery input contract

Before inspecting or mutating provider state for an `epic` or `story` delivery projection, require:

- a verified stable blob URL to an authoritative `SPEC.md`; local SHA plus path is insufficient
- frontmatter `readiness: agent-ready`
- stable `US-###` user stories
- stable `AC-###` acceptance criteria
- every criterion carrying `Covers: US-###`
- no uncovered story and no criterion pointing to a missing story
- accepted technical/testing decisions and verification seams
- prototype verdict links when prototypes informed the decisions

If any requirement is missing, return a readiness failure naming every gap. Write nothing to the provider.

## Projection contract

Create one capability-boundary epic for the spec. Derive the fewest product-facing stories that preserve all `US-###` outcomes and `AC-###` evidence. Every story must:

- name its source `US-###` records
- name its covered `AC-###` records
- be agent-sized
- be a vertical tracer bullet with one demonstrable user, operator, or system outcome
- remain understandable without the implementation plan

Split only across distinct product outcomes, acceptance signals, provider boundaries, or true dependencies. Technical layers are not stories.

## Readiness before mutation

Build and validate the complete intended projection in memory before the first provider write:

1. Resolve the target from `.devpunks/settings.json`.
2. Validate the spec and traceability.
3. Validate every story as an agent-sized tracer bullet.
4. Resolve every blocker to a projected story.
5. Reject self-blockers, missing targets, and cycles.
6. Assign milestones across the overview-level taxonomy from `fog` through `epic` (`fog`, `grilling`, `research`, `prototype`, `epic`) for project-level chronological precedence. When supported, assign each child story the same containing overview milestone; never derive distinct story milestones. Native blockers explain story relations.
7. Validate provider representation and required native primitives.
8. Only after every check passes, write immediately without a separate approval stop.

A validation failure produces zero mutations. If a provider fails during the write sequence, stop, report created identifiers, and do not claim atomicity or readiness.

## Intake resolution

When the work began as a pre-spec `fog`, `grilling`, `research`, or `prototype` item:

- keep that intake item as historical decision evidence
- resolve it with the immutable spec link and the accepted outcome
- create a separate delivery epic projection
- never silently promote or relabel the intake item as the delivery epic

## Provider model

```text
Backlog root
  fog
  capability module
    grilling
    research
    prototype
    epic
      story

Project overview execution milestones
  M1 -> M2 -> M3 ...
  (assigned only to overview-level items from fog through epic)
```

Capability grouping is independent from chronology. Native blockers are authoritative for story relations. Milestones are a project-overview signal: assign them to overview-level `fog`, `grilling`, `research`, `prototype`, and `epic` items when chronological precedence is useful, and let their containing stories share that milestone when the provider supports membership. Never use milestone values to order stories.

Provider representation is defined in [assets/providers/](assets/providers/). Use actual metadata and native hierarchy/dependency primitives. Do not invent fields, flatten child stories, or replace representable blockers with prose.

## Body ownership

Epic bodies contain outcome, scope, cross-story constraints, the immutable spec link, and child story links.

Story bodies contain product outcome, `US-###` sources, `AC-###` coverage, demonstration signal, non-goals, dependencies, and durable accepted-artifact links.

Keep `PLAN.md` task ids, file paths, validation commands, worker assignments, and code structure out of backlog bodies. Concrete planning remains downstream in `delivery-phase` / `create-plan`.
