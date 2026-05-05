# Backlog Sync

Use after `$requirements-grill` and before final spec drafting.

## Trigger

Run `$write-backlog` automatically when grill outcomes change:

- the epic/capability boundary
- child-story acceptance signals, scope, or canonical terms
- missing, parked, moved, or future-scope stories
- story ordering, blockers, or parent/child relationships

Skip only for wording clarifications that do not change backlog scope, story meaning, or ordering.

## Load

Follow:

- `../../../requirements/write-backlog/SKILL.md`
- `../../../requirements/write-backlog/REFERENCE.md`
- `../../../requirements/write-backlog/assets/concepts/backlog-model.md`

If grill artifacts exist, read:

1. `docs/<topic>-grill-status.md`
2. `docs/<topic>-grill-log.md`

## Rules

- The parent epic remains the spec anchor.
- Child stories remain product-facing slices beneath that epic.
- Derive backlog changes only from accepted decisions and locked direction.
- Preserve parked branches as deferred scope, follow-up epic/story candidates, or backlog notes.
- Keep unresolved still-open items out of committed story scope unless explicitly marked.
- Use native parent/child and `blockedBy` / `blocks` relations when the provider supports them.
- Do not add implementation details, file paths, TDD targets, validation commands, or worker handoffs to backlog bodies.

## Handoff

- reread the updated epic and child stories before drafting
- incorporate all child-story requirements into the spec
- add backlog item ids/URLs to spec links when available
- mention deferred backlog items only as non-goals, future scope, or `Open Questions`

Do not finalize a backlog-backed spec from stale pre-grill story text.
