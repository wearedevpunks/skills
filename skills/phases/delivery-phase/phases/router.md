# Router Phase

Use this file to choose the next delivery phase. Do not read other phase files
until this router selects one.

## Inputs To Inspect

- User request and explicit mode: full delivery, resume, HITL checkpoint, or closeout.
- Tracker item, issue, PR, branch, or spec folder named by the user.
- Existing `SPEC.md`, `PLAN.md`, implementation notes, review output, debug evidence, docs ingest notes, stack state, and validation evidence.
- Relevant repo guidance only when needed to identify ownership or validation surface.

## Routing Order

1. If goal bounds are unclear, stop and ask one concrete question.
2. If no reviewed matching spec exists, load [spec.md](spec.md).
3. If the spec exists but is stale, contradictory, or missing required child-story scope, load [spec.md](spec.md).
4. If no execution-ready matching plan exists, load [plan.md](plan.md).
5. If the plan exists but lacks dependencies, validation gates, owned paths, or mode choice, load [plan.md](plan.md).
6. If accepted plan work is incomplete, load [implement.md](implement.md).
7. If implementation exists but mandatory review is missing or stale, load [review.md](review.md).
8. If review found in-scope non-runtime blockers, route back to [implement.md](implement.md).
9. If validation or review produced runtime evidence, load [debug.md](debug.md).
10. If docs-affecting changes exist and ingest is missing, load [docs-ingest.md](docs-ingest.md).
11. Otherwise load [closeout.md](closeout.md).

## HITL Behavior

When the user asks for manual control, route only the requested phase and stop
after writing its phase handoff. Do not continue to the next phase in the same
turn unless the user explicitly asks.

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
