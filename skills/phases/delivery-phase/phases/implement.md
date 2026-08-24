# Implement Phase

Use this phase when an accepted plan exists and implementation work remains, or
when a retained review opened `repair_active` for in-scope non-runtime blockers.

## Delegate

Load `implement-spec` only after this phase is selected.

## Rules

- Preserve the plan's dependencies, owned paths, validation gates, and wave boundaries.
- Launch every currently unblocked task whose write scope is disjoint as the
  active worker wave.
- Use a one-worker wave only when dependencies or ownership leave one task
  unblocked.
- Keep changes inside the active delivery scope.
- When current evidence triggers `$handback`, return it to the router without
  expanding worker ownership.
- Parent orchestration owns shared notes and final validation evidence.
- For UI work, require `implement-spec` to carry durable before/after links through `UI Evidence Links`; use `repo-asset-management` only through that evidence contract.
- If runtime evidence appears during validation, finish the phase handoff and route to debug.
- Preserve review lineage, `review_count`, `repair_count`, and the opening
  `review_run_id` through the repair.
- After an ordinary repair with `review_count < 3`, stale the preceding report
  and enter `review_due` with the changed target identity.
- After fix 3 (`review_count = 3`, `repair_count = 3`), enter
  `focused_validation`. Run only the focused validation required by accepted
  evidence. Failure remains `repair_active` in epoch 3; passing records
  `clean_handoff`. Fix 3 never opens review 4.

## Completion State

Write or verify:

- implementation notes or equivalent evidence
- files changed and plan tasks completed
- validation commands and results
- UI Evidence links for changed user-visible surfaces, or explicit no-op reason
- remaining blockers or follow-up debt
- resulting state: `review_due`, `debug_active`, `focused_validation`,
  `clean_handoff`, or blocked

Then stop or re-enter `delivery-phase` for routing.
