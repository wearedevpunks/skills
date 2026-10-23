---
name: review-phase
description: >-
  One Full Code Review Pass of a committed Git change: two Axis Runs
  (Standards, Spec) with Engine Fallback, one Adjudicator, one Pass Report and
  one return route. Delivery starts it at review due; the operator invokes it
  for a standalone commit or range.
disable-model-invocation: true
---

# Review Phase

`scripts/review.mjs` does every mechanical part of the pass: Review Packet
identity, pass budget, source context, sizing, both Axis Runs with Engine
Fallback, and the Pass Report write and commit. Each call prints one JSON line.
The agent makes four calls, starts one Adjudicator and returns the route. The
reviewed change stays readonly; the Pass Report that `retain` commits is the
pass's only write.

`<skill>` is this skill's directory. Run each command from the repository root.

## Procedure

Delivery enters at step 1 and continues at the step its `next` names
(`prepare` 2, `run` 3, `adjudicate` 4, `retain` 5, `done` 6). Standalone review
enters at step 2.

1. **Status.** `node <skill>/scripts/review.mjs status --goal <delivery-dir>`.
   Complete when the line carries `next`, `run_dir` and `pass_count`.
2. **Prepare.** `node <skill>/scripts/review.mjs prepare --goal <delivery-dir>
   --base <sha>`, or `prepare --standalone <commit-or-range>`. Add each option
   the caller supplies:
   - `--spec <folder>`: the governing spec folder.
   - `--accepted-risk <kind>:<evidence>`: the trigger for a second pass.
   - `--human-direction <evidence>`: the direction for a further pass.

   `prepare` enforces the pass budget: one pass by default, a second only on an
   accepted-risk trigger, a further pass only with explicit human direction.
   Complete when the line carries `run_id`, `run_dir` and `"blocker": null`. A
   non-null `blocker` is one sentence: relay it unchanged to the caller and
   stop.
3. **Run.** Start `node <skill>/scripts/review.mjs run --run-dir <run_dir>` as
   a background command and end the turn. The harness notification of its exit
   resumes this procedure: read the command's output once for its one JSON
   line. Complete when that line is in context with `"blocker": null`; relay a
   non-null `blocker` unchanged and stop.
4. **Adjudicate.** Start exactly one readonly Adjudicator subagent with the
   brief in [references/adjudicator.md](references/adjudicator.md) and the
   `run_dir`. Complete when the Adjudicator has returned and its notification
   reports its token total.
5. **Retain.** `node <skill>/scripts/review.mjs retain --run-dir <run_dir>
   --subagent-tokens <n>`, with `<n>` the token total from the Adjudicator's
   notification. When `retain` refuses `adjudication.json`, send its error to
   the same Adjudicator, which rewrites the file, and retain again. Complete
   when the line carries `pass_report`, `run_id`, `commit`, `route` and
   `findings`.
6. **Return.** Return `pass_report`, `review_run_id` (the `run_id`),
   `route.primary`, `route.secondary_debt` and the `findings` list to the
   caller, with the transition [references/routing.md](references/routing.md)
   names for that route. The retain line is the presentation source: its
   `findings` (`id`, `axis`, `severity`, `location`, `return_route`) and
   `rejected_count` are the caller's summary; the Pass Report stays the review
   authority. After `next: done`, read these fields from
   `<delivery-dir>/reviews/pass-<pass_count>.json`. Complete when the caller
   holds the route.

Repair, debugging, debt capture, docs ingest and closeout belong to the caller
after step 6.
