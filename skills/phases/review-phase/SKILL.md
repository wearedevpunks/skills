---
name: review-phase
description: One Full Code Review Pass of a committed change by one fresh reviewer, ending in one Pass Report and route; delivery starts it, or run it on a standalone commit or range.
disable-model-invocation: true
---

# Review Phase

`scripts/review.mjs` does the mechanics: pass budget, Review Packet, Pass Report
write and commit. Each call prints one JSON line; a non-null `blocker` is one
sentence to relay unchanged to the caller, then stop. The reviewed change stays
readonly; the Pass Report that `retain` commits is the pass's only write.
`<skill>` is this skill's directory. Run each command from the repository root.

## Procedure

Delivery enters at step 1 and continues at the step its `next` names (`prepare`
2, `review` 3, `retain` 4, `done` 5). Standalone review enters at step 2.

1. **Status.** `node <skill>/scripts/review.mjs status --goal <delivery-dir>`.
   Complete when the line carries `next`, `run_dir` and `pass_count`.
2. **Prepare.** `node <skill>/scripts/review.mjs prepare --goal <delivery-dir>
   --base <sha>`, or `prepare --standalone <commit|base..head>`. Add each option
   the caller supplies: `--spec <folder>`, `--accepted-risk <kind>:<evidence>`
   (second pass), `--human-direction <evidence>` (further pass). `prepare`
   leaves generated files out of the review: lockfiles, generated snapshots,
   and paths that `.gitattributes` at the reviewed head marks
   `linguist-generated` or `-diff`. When the rest exceeds the review budget
   (`REVIEW_BUDGET_BYTES` in the script), it ranks source before tests before
   docs, larger diffs first, keeps the first file and each later file that
   still fits, and leaves the rest out as `over-budget`: that pass is a
   partial review. Complete when the line carries `run_id` and `run_dir`.
3. **Review.** Start one fresh general-purpose subagent in the foreground: a
   new agent with no parent context, never a fork or an earlier agent (Claude
   `Agent` without fork, Codex `spawn_agent` without forked context). Its whole
   prompt is the path of [references/reviewer.md](references/reviewer.md) and
   the `run_dir`, with no summary or view of the change. Complete when its
   one-line result and token total are in context.
4. **Retain.** `node <skill>/scripts/review.mjs retain --run-dir <run_dir>
   --subagent-tokens <n>`, with `<n>` the reviewer's token total. When `retain`
   refuses `findings.json`, send its error to this reviewer, which rewrites the
   file, and retain again. Complete when the line carries `pass_report`,
   `run_id`, `commit`, `route`, `findings` and `coverage`.
5. **Return.** Return `pass_report`, `review_run_id` (the `run_id`),
   `route.primary`, `route.secondary_debt` and the `findings` list (`id`,
   `priority`, `kind`, `location`, `return_route`) and `coverage`, with the
   transition [references/routing.md](references/routing.md) names for that
   route. A `coverage.scope` of `partial` is a partial review: present it as
   one, and list each `coverage.left_out` path with its reason. Write what
   the user reads through `$wait-what`. The
   retain line is the presentation source; the Pass Report stays the review
   authority. After `next: done`, read these fields from
   `<delivery-dir>/reviews/pass-<pass_count>.json`. Complete when the caller
   holds the route.

The caller owns repair, debugging, debt capture, docs ingest and closeout.
