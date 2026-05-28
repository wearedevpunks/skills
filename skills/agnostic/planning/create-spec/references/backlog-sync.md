# Backlog Sync

Use before final spec drafting when backlog context exists and the accepted spec direction changes the assigned epic or stories.

## Trigger

Run `$write-backlog` automatically when the user's objective, discovery, or grill outcomes change:

- the epic/capability boundary
- the parent epic title, problem statement, outcome, non-goals, or acceptance posture
- child-story acceptance signals, scope, or canonical terms
- missing, parked, moved, or future-scope stories
- story descriptions that now conflict with the spec objective
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
- The assigned epic or story may be refactored when it no longer matches the accepted spec objective.
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
