# Router Phase

Use this file to choose the next design phase. Do not read other phase files until selected.

## Inputs To Inspect

- User request and explicit mode: intake, grill, prototype, approval, backlog, delivery handoff, resume, or direct entry.
- Existing routes/pages/flows, theme CSS or tokens, global styles, component files, screenshots, Figma/design inputs, content sources, and brand constraints.
- Grill status, artifact intent, generated images, prototype URLs/files, approval notes, approved artifact sets, backlog ids, and delivery state.
- `.devpunks/settings.json` only when provider or asset evidence affects routing.

## Route Invariants

- Router output precedes every phase.
- Direct entry still goes through this router.
- Direct entry is valid only when prerequisite evidence is present and fresh.
- Load one phase only; never inspect sibling phase files speculatively.
- Child-skill delegation is phase-local.
- Reuse artifacts only after staleness checks.
- Record a route trace: timestamp, selected phase, evidence, rejected alternatives.

## Staleness Rules

Treat evidence as stale when scope, route, theme, component, content, artifact intent, approval status, backlog ids, or target surface changed after it was produced.

Treat visual artifacts as stale when screenshots, Figma/design inputs, generated images, prototype links, or durable asset links no longer match current code, accepted constraints, or user-visible scope.

## Routing Order

1. If the design goal or target surface is unclear, stop and ask one concrete question.
2. If design evidence is missing, incomplete, low-confidence, or stale, load [intake.md](intake.md).
3. If accepted constraints are missing or conflict with evidence, load [grill.md](grill.md).
4. If artifact intent is missing, ask whether the user wants image references or prototype artifacts.
5. If requested artifacts are missing or stale, load [prototype.md](prototype.md).
6. If artifacts exist but approval is missing, load [approval.md](approval.md).
7. If an approved artifact set exists without backlog context, load [backlog.md](backlog.md).
8. If backlog ids exist but delivery is not activated, load [delivery-handoff.md](delivery-handoff.md).
9. Otherwise report completion with route trace evidence.

## Low-Confidence Intake

Low-confidence means fewer than routes plus one style, component, or content source. Route to intake; that phase asks one concrete clarification or requests one screenshot.

## Router Output

```text
Selected phase:
Evidence:
Next file:
Stop or re-enter:
Blockers:
Route trace:
```

## Phase Handoff

```text
Phase:
Status: complete | blocked | skipped
Scope:
Artifacts:
Validation:
Open questions:
Next route:
Blockers:
```
