---
name: design-phase
description: Routes product design work through evidence intake, lean grill, prototype, approval, backlog, and delivery handoff.
disable-model-invocation: true
---

# Design Phase

## Quick Start

`design-phase` is a route-gated skill for turning existing design evidence into approved artifacts, backlog work, and active delivery.

1. Read [phases/router.md](phases/router.md).
2. Inspect only enough request, repo, design, artifact, backlog, and delivery state to choose one phase.
3. Emit the router output before loading a phase file.
4. Load exactly one selected file from `phases/`.
5. Complete that phase, write the phase handoff, then stop or re-enter `design-phase`.

Completion of one phase does not imply loading the rest.

## Entry Modes

- **Intake:** collect existing design-system evidence.
- **Grill:** close lean goals, constraints, scope, and conflicts.
- **Prototype:** produce the requested image reference or prototype artifact.
- **Approval:** record accepted artifacts per user-visible scope unit.
- **Backlog:** convert approved artifacts into backlog context.
- **Delivery handoff:** prepare the approved brief for explicit user invocation of `$delivery-phase`.

Direct entry into any mode still starts at the router.

## Phase Files

- [phases/router.md](phases/router.md): choose the next phase from evidence.
- [phases/intake.md](phases/intake.md): gather existing design context and confidence.
- [phases/grill.md](phases/grill.md): run a lean requirements grill.
- [phases/prototype.md](phases/prototype.md): delegate artifact production.
- [phases/approval.md](phases/approval.md): record approved artifact sets.
- [phases/backlog.md](phases/backlog.md): call `write-backlog` with artifact context.
- [phases/delivery-handoff.md](phases/delivery-handoff.md): present the brief and stop for explicit user invocation of `$delivery-phase`.

## Rules

- Do not read phase files other than `router.md` until selected.
- Do not activate child skills from this entrypoint.
- The router chooses exactly one next phase.
- Every phase writes a phase handoff with artifacts, validation, blockers, and next route.
- Route trace entries are required across prototype, approval, backlog, and delivery handoff.
