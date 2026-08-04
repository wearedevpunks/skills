# Implement Phase

Use this phase when an accepted plan exists and implementation work remains, or
when review returned in-scope non-runtime blockers.

## Delegate

Load `implement-spec` only after this phase is selected.

## Rules

- Read the selected `Execution Mode` from user or plan intent and require
  `implement-spec` to record it in `IMPLEMENTATION-NOTES.md`.
- Preserve the plan's dependencies, owned paths, validation gates, and wave boundaries.
- In `sequential`, delegate the entire task loop to exactly one implementation
  worker; the parent owns orchestration, review, and parent validation.
- Only explicitly selected `parallel` may launch all safe disjoint tasks in the
  active waves. Dependency and ownership constraints may produce one-task waves.
- Keep changes inside the active delivery scope.
- Parent orchestration owns shared notes and final validation evidence.
- For UI work, require `implement-spec` to carry durable before/after links through `UI Evidence Links`; use `repo-asset-management` only through that evidence contract.
- If runtime evidence appears during validation, finish the phase handoff and route to debug.

## Completion State

Write or verify:

- implementation notes or equivalent evidence
- files changed and plan tasks completed
- validation commands and results
- UI Evidence links for changed user-visible surfaces, or explicit no-op reason
- remaining blockers or follow-up debt
- whether mandatory review is now needed

Then stop or re-enter `delivery-phase` for routing.
