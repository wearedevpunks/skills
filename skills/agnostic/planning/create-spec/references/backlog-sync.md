# Backlog Sync

Use this reference after a `$requirements-grill` phase and before final spec drafting.

## Goal

Keep the backlog aligned with grilled requirements so the epic, child stories, and spec describe the same product scope.

## When to Run

Run `$write-backlog` automatically when grill outcomes change any of these:

- the epic/capability boundary
- child story acceptance signals
- missing child stories that should exist under the epic
- stories that should be parked or moved to future scope
- story ordering, blockers, or native parent/child relationships
- canonical terms that should appear in epic/story bodies

Skip backlog sync only when the grill clarified wording that does not change backlog scope, story meaning, or ordering.

## Required Inner Behavior

Load and follow:

- `../../../requirements/write-backlog/SKILL.md`
- `../../../requirements/write-backlog/REFERENCE.md`
- `../../../requirements/write-backlog/assets/concepts/backlog-model.md`

If grill artifacts exist, `$write-backlog` must read:

1. `docs/<topic>-grill-status.md`
2. `docs/<topic>-grill-log.md`

## Sync Rules

- The parent epic remains the spec anchor.
- Child stories remain product-facing slices beneath that epic.
- Derive backlog changes only from accepted decisions and locked direction.
- Preserve parked branches as deferred scope, follow-up epic/story candidates, or backlog notes.
- Keep unresolved still-open items out of committed story scope unless explicitly marked.
- Use native parent/child and `blockedBy` / `blocks` relations when the provider supports them.
- Do not add implementation details, file paths, TDD targets, validation commands, or worker handoffs to backlog bodies.

## Handoff Into Spec

After backlog sync:

- read the updated epic and child stories again before drafting
- incorporate all child-story requirements into the spec
- add backlog item ids/URLs to spec links when available
- mention deferred backlog items only as non-goals, future scope, or `Open Questions`

Do not finalize a backlog-backed spec from stale pre-grill story text.
