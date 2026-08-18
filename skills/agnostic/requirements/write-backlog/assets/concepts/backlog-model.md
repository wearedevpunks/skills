# Backlog Model

## Canonical model

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

The direct concepts are `fog`, `grilling`, `research`, `prototype`, `epic`, and `story`. Each is visible, assignable, searchable, linkable, and closeable. A provider adapter may represent them with native issue types, fields, labels, columns, or a stable title convention; no shared classification field is required. If no representation preserves the direct concept, preflight fails.

## Placement

- `fog`: root-level uncertainty, never delivery scope or a parent container
- `grilling`: capability-scoped human decision work
- `research`: capability-scoped readonly evidence work
- `prototype`: capability-scoped experiment work
- `epic`: one capability-boundary projection of an authoritative agent-ready spec
- `story`: product-facing child tracer bullet derived from spec stories and criteria

Each capability module groups durable product ownership. It stays separate from project-overview milestones and does not determine implementation order.

## Traceability and story readiness

Every projected story names its source `US-###` records and covered `AC-###` records. Before mutation, prove:

- every spec story is represented
- every criterion maps to an existing story
- every criterion is covered by at least one projected story
- every projected story has a demonstrable end-to-end outcome
- each story is small enough for one prepared agent session

Do not create layer stories such as database, API, frontend, tests, or wiring. Fold those concerns into a vertical story or leave them for concrete planning.

## Blocker graph

Use native `blockedBy` / `blocks` relations where available.

Before mutation:

1. Resolve every blocker identifier to a projected story.
2. Reject missing targets and self-blockers.
3. Detect and reject cycles across the complete selected graph.
4. Keep every projected story unmilestoned; native blockers explain story relations.
5. Verify every blocker target is present in the selected projection.

Use milestones only across the overview-level taxonomy from `fog` through `epic` (`fog`, `grilling`, `research`, `prototype`, `epic`) when the project overview needs chronological precedence. Do not create milestones for stories or use milestone assignment to encode story order; update native blockers when story relations change.

## Mutation boundary

Validate the full agent-ready projection, graph, provider destination, hierarchy support, and dependency representation before the first provider write. A failed validation writes nothing. After validation, write immediately without an approval checkpoint.

Provider execution can still fail mid-sequence. Report every created identifier and the failure honestly; never describe a multi-request provider as transactionally atomic.

## Intake and downstream handoff

Resolve any pre-spec intake item with the immutable spec link and accepted outcome. Preserve it as history; do not silently promote it into the delivery epic.

The delivery epic and stories link back to `SPEC.md`. Concrete files, commands, tests, worker assignments, and execution order belong later in `delivery-phase` / `create-plan`.
