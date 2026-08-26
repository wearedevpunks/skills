# Implement Phase

Use this phase when an accepted plan exists and implementation work remains, or
when a retained review opened `repair_active` for in-scope non-runtime blockers.

## Delegate

Load `implement-spec` only after this phase is selected.

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Rules

- Read the plan's uniform `task_identity_mode`. Provider-task work preserves
  one stable provider Task identity per `Tn`, the same `V*`, and native blocker
  edges. Planning-only work preserves `Tn` as the execution identity,
  `not_applicable` identity slots, `unprojected` relations, and its sync-skip
  reason.
- For provider-task work, immediately route each directly observed work start,
  blocker, pull request, merge, staging deployment, or production deployment
  through `write-backlog`'s
  [delivery-status.md](../../write-backlog/references/delivery-status.md) branch.
  Require exact readback before advancing the Task. Planning-only work emits no
  provider lifecycle mutation or readback claim.
- Merge is never deployment evidence. Merge, staging, and production remain
  distinct directly observed facts. Complete a Fog only when production
  evidence covers every accepted resulting Story and Task.
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
- exact provider readback for every observed provider-task fact; explicit
  planning-only non-applicability otherwise
- resulting state: `review_due`, `debug_active`, `focused_validation`,
  `clean_handoff`, or blocked

Then stop or re-enter `delivery-phase` for routing.
