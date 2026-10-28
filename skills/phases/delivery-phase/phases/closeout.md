# Closeout Phase

Use this phase when spec, plan, implementation, review, debugging if needed,
docs ingest or no-op, and validation are complete.

## Checks

- Require a valid Pass Report for this delivery (`review.mjs status` reports
  `pass_count` of at least 1) before any other check. A missing one returns to
  [review.md](review.md); only a Pass Report from `review-phase` counts as Code
  Review.
- After review and docs ingest or its verified no-op, create the final path-limited commit
  from delivery-owned paths. Preserve unrelated dirty user
  files and exclude them from staging.
- Compare the trees. When the final tree differs from the pre-review candidate,
  rerun every required release classification and exact-tree provider proof against
  the final commit. A failed or unavailable required proof blocks closeout.
- Push the final commit, then await its CI result and report it per check. When
  the project has no full-suite CI or CI runs no E2E, run the one local broad run
  instead, covering only what CI lacks, and report it as a local broad run.
  `implement-spec`'s `references/validation-scope.md` owns this policy.
- Once that CI result and exact-tree proof pass, hand over each Touched
  Repository's delivery PR:
  1. Read `gh pr view --json body,isDraft,author,state,reviewRequests`.
  2. Resolve `$pr` and regenerate its Managed Region from final evidence:
     Verification, Runtime Validation, UI Evidence Links, CI per check, and
     the Pass Report route and open findings. Write it with
     `gh pr edit --body-file`.
  3. When the PR is open and a draft, run `gh pr ready`.
  4. Request review from the Directing Human, the person who asked for the
     change, with `gh pr edit --add-reviewer <login>` when their login is
     known and differs from the PR author; otherwise report who must approve.
  5. Read back: the Managed Region bytes match, `isDraft` is false, and the
     review request is present when step 4 ran.
  6. In `provider-task` mode, record the pull request state `ready` and the
     review request on every linked Task through `write-backlog`'s
     delivery-status branch, and read it back.

  A failed write stops closeout with the exact failed step; a rerun starts at
  step 1. Merge stays with the human.
- After exact-tree proof passes, route final directly observed delivery facts
  through `write-backlog`'s
  [delivery-status branch](../../../agnostic/requirements/write-backlog/references/delivery-status.md).
  Close provider work and the
  goal only when their acceptance conditions pass. Fog completion additionally
  requires production evidence for every accepted resulting Story and Task.
- Summarize goal outcome and remaining blockers.
- Report phase path actually taken; do not imply skipped phases ran.
- Report validation commands, browser checks, smoke tests, or manual scenarios,
  labelled focused, CI, or local broad run. Focused checks never report as a
  full-suite pass.
- Tear down the delivery's Owned Stack through owned cleanup.
- Report review result and whether findings remain.
- Report debugging result or explicit skip reason.
- Report docs ingest result or explicit no-op reason.
- For UI changes, verify the `$pr` Evidence section, or the PR-ready handoff when no PR exists, carries the durable before/after `UI Evidence` links.

## Accepted Repair Continuity

Follow [review.md](review.md) for Focused Repair Validation, affected Verification
reruns and risk-triggered second-pass eligibility. Preserve the opening
`pass_report` and consumed repair run IDs. On failure, use
[bounded diagnosis and scope custody](../references/failure-continuity.md).

## Output

Return a concise delivery report with:

- goal
- current phase state
- artifacts touched
- validation
- review
- debugging
- docs ingest
- tracker or PR state, with the PR handover readback
- UI Evidence state when user-visible UI changed
- exit: done, blocked, or split into follow-up

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to this completion evidence. Continue only in Full Delivery;
otherwise stop at the requested boundary.
