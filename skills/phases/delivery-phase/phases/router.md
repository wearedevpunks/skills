# Router Phase

Use this file to choose the next delivery phase. Do not read other phase files
until this router selects one.

## Inputs To Inspect

- User request and entry intent: full delivery, resume, HITL checkpoint, or closeout.
- Tracker item, issue, PR, branch, or planning folder named by the user.
- Existing `PLAN.md`, implementation notes, review output, debug evidence, docs ingest notes, stack state, and validation evidence.
- Relevant repo guidance only when needed to identify ownership or validation surface.

## Entry Guard

If goal bounds are unclear, stop and ask one concrete question.

## Routing Order

1. If no execution-ready matching plan exists, load [plan.md](plan.md).
2. If the plan exists but lacks dependencies, owned paths, validation gates, or wave boundaries, load [plan.md](plan.md).
3. If accepted plan work is incomplete, load [implement.md](implement.md).
4. If implementation exists but mandatory review is missing or stale, load [review.md](review.md).
5. If review found in-scope non-runtime blockers, route back to [implement.md](implement.md).
6. If validation or review produced runtime evidence, load [debug.md](debug.md).
7. If docs-affecting changes exist and ingest is missing, load [docs-ingest.md](docs-ingest.md).
8. Otherwise load [closeout.md](closeout.md).

## HITL Behavior

A HITL checkpoint is explicit user control. When requested, route only the
requested phase and stop after writing its phase handoff.

## Resume Behavior

Assume earlier phases may have been completed manually through their direct
skills. Verify artifact freshness; do not re-run a phase only because
`delivery-phase` did not run it.

## Output

Report:

- selected phase
- evidence that selected it
- child skill or phase file to load next
- blocker question if no phase can be selected safely
