# Closeout Phase

Use this phase when spec, plan, implementation, review, debugging if needed,
docs ingest or no-op, and validation are complete.

## Checks

- Summarize goal outcome and remaining blockers.
- Report phase path actually taken; do not imply skipped phases ran.
- Report validation commands, browser checks, smoke tests, or manual scenarios.
- Report review result and whether findings remain.
- Report debugging result or explicit skip reason.
- Report docs ingest result or explicit no-op reason.
- For UI changes, verify the PR body, PR comment, or PR-ready handoff includes durable before/after `UI Evidence` links.
- When a PR exists, run `stack status` and `stack sync --dry-run`.
- If the PR is stack-dependent and dry-run reports pending changes, run
  `stack sync` before closeout.
- Missing `stack` blocks stack-dependent closeout, but not independent
  trunk-based work.

## Output

Return a concise delivery report with:

- goal
- current phase state
- artifacts touched
- validation
- review
- debugging
- docs ingest
- stack
- tracker or PR state
- UI Evidence state when user-visible UI changed
- exit: done, blocked, or split into follow-up
