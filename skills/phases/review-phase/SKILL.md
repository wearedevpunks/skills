---
name: review-phase
description: >-
  Explicit readonly review of one frozen delivery diff or standalone artifact
  bundle, ending with one retained all-lens report and routing output.
disable-model-invocation: true
---

# Review Phase

Review one frozen target through every normative lens. The reviewed target
remains readonly. One designated writer may change only the report, navigation,
and wiki-log retention envelope.

This phase owns normalization, inspection, report retention, and routing output.
It does not plan work, classify implementation stages, assign implementation
skills, create implementation-stage evidence, or repair findings.

## Run

1. Read [REFERENCE.md](REFERENCE.md), then load only the mode references it
   points to. Completion: the explicit operator invocation has a valid
   `review_due` context or a fresh `report_retention_pending` resume context.
2. For `review_due`, apply the mode budget guard. Completion: delivery has
   preallocated ordinal `review_count + 1` and fixed `review_run_id`, or
   standalone has fixed its target-derived run identity, and the invocation has
   entered `review_running`. For a fresh retention resume, continue at step 6
   without rerunning lenses.
3. Freeze the target and governing sources. Completion: one immutable bounded
   snapshot and its target, bounds, and source hashes exist.
4. Run the all-lens composition once. Completion: every lens has an explicit
   outcome and every accepted finding was verified against the frozen evidence.
5. Write the unique local report and enter `report_retention_pending` without a
   counter change. Completion: the report satisfies the durable schema.
6. Retain the allowed envelope and verify the retained ref contains its commit.
   Completion: report path, report SHA-256, report commit SHA, and verified
   retained ref exist outside the immutable report.
7. Return the report evidence and route. Then terminate without entering a
   repair state; delivery or the standalone caller owns every next action.

## Boundaries

- Normalize the smallest certain inclusive scope. Expand to the full repository
  only when the caller explicitly requests it.
- Use the smallest safe readonly validation. Missing required RED/GREEN proof is
  a finding; review does not create implementation evidence or repairs.
- Stop on the graph outcome: `review_complete`, `review_due`,
  `report_retention_pending`, `review_failed`, or `review_budget_exhausted`.
- External GitHub and Codex PR reviewer integration is outside this capability.
