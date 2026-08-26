# Closeout Phase

Use this phase when spec, plan, implementation, review, debugging if needed,
docs ingest or no-op, and validation are complete.

## Checks

- After review and docs ingest or its verified no-op, create the final path-limited commit
  from delivery-owned paths. Preserve unrelated dirty user
  files and exclude them from staging.
- Compare the trees. When the final tree differs from the pre-review candidate,
  rerun every required release classification and exact-tree provider proof against
  the final commit. A failed or unavailable required proof blocks closeout.
- After exact-tree proof passes, route final directly observed delivery facts
  through `write-backlog`'s
  [delivery-status branch](../../../agnostic/requirements/write-backlog/references/delivery-status.md).
  Close provider work and the
  goal only when their acceptance conditions pass. Fog completion additionally
  requires production evidence for every accepted resulting Story and Task.
- Summarize goal outcome and remaining blockers.
- Report phase path actually taken; do not imply skipped phases ran.
- Report validation commands, browser checks, smoke tests, or manual scenarios.
- Report review result and whether findings remain.
- When fix 3 occurred, require `clean_handoff` linking immutable review-3 report,
  final changes, passing focused validation, and clean status. Do not require a
  fourth review.
- Report debugging result or explicit skip reason.
- Report docs ingest result or explicit no-op reason.
- For UI changes, verify the PR body, PR comment, or PR-ready handoff includes durable before/after `UI Evidence` links.

## Output

Return a concise delivery report with:

- goal
- current phase state
- artifacts touched
- validation
- review
- debugging
- docs ingest
- tracker or PR state
- UI Evidence state when user-visible UI changed
- exit: done, blocked, or split into follow-up
