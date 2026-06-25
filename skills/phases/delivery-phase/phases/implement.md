# Implement Phase

Use this phase when an accepted plan exists and implementation work remains, or
when review returned in-scope non-runtime blockers.

## Delegate

Load `implement-spec` only after this phase is selected.

## Rules

- Preserve the plan's `parallel: true` or `parallel: false` mode.
- If no mode exists, choose the smallest safe mode:
  - `parallel: false` for coupled or small changes.
  - `parallel: true` only for independent waves with disjoint write scopes.
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
