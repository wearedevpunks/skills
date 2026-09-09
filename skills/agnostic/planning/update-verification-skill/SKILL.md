---
name: update-verification-skill
description: Repair selected executable coverage when implement-spec encounters an Uncovered Behavior; audit the full Project Verifier only on explicit full-audit invocation.
---

# Update Verification Skill

Maintain executable knowledge inside `.agents/skills/verify-behavior/references/` on
the current delivery branch and PR. Read `verify-behavior`'s Reference contract for
structure and safety, and [upstream provenance](../create-verification-skill/references/upstream.md)
for the adaptation. `implement-spec` owns Verification and acceptance; docs ingestion
reads Feature Maps without maintaining them. Product code and expected product
semantics remain with their owning implementation/debugging workflow.

## Select and reconcile

1. Retain the original scenario, affected criteria and authority/code/runtime/scenario
   identities. Locate the selected app through the project index. Missing surface
   returns to `implement-spec` for `create-verification-skill`. Ambiguous targets block
   with the exact missing selector. Default scope is the selected Uncovered Behavior;
   explicit full-audit scope alone covers the complete index.
2. Check selected Feature Map index and sibling files for missing, duplicate, dead or
   stale pointers. Read applicable routed wiki specifications, behavior pages, flows,
   domain knowledge, current source and runtime entry points. For each selected feature
   return a concise source summary, cited entry points, likely drift and one live recipe.
   In an explicit multi-feature audit, use concurrent readonly source readers when
   delegation is available; the coordinator alone drives and edits. Otherwise read
   serially and report the capability limitation. Source readers never drive the app.
3. Reconcile every selected source summary; merge overlapping live recipes into the
   fewest practical app states and spot-check drift citations. Inspect related recent
   source churn for missing selected user paths; require a concrete source citation.
   Preserve unrelated app references, features, journeys and helpers byte-for-byte.
   Retire an obsolete entry only when current source proves obsolescence, product
   authority supports the meaning, and all affected index/journey/helper references
   are reconciled. Contradictory product-expected semantics means product failure or
   an unresolved authority blocker, never permission to erase an expected behavior.

## Drive and triage

Follow the app's Launch model: one owned long-lived server/UI instance driven serially,
or a fresh isolated session for each short-lived CLI drive. Live proof is required even
when source looks clean. Run Doctor before each fresh session and after surprising or
failed behavior. After a surprising failure, restore known owned state (reset/relaunch
when needed), then renew Doctor before another Drive. Capture action,
observable result, Scenario Falsifier, side effects and applicable Relevant Negative
Condition's actual downstream result. Confirm evidence survives every cleanup.

- Wrong or missing executable description: repair selected reference drift.
- Working behavior the harness cannot drive: repair the selected app-owned helper or
  drive recipe; document executable invocation, then re-drive the corrected path.
- Doctor failure caused by reference drift: correct within scope, restart only what
  the fix invalidated and retry once; remaining inability returns `blocked`.
- Inaccessible state: retain route attempted and exact credential, entitlement, OS or
  external prerequisite. Add a missing prerequisite to the reference, but classify
  the scenario `blocked`; unreachable is not verified.
- Current verifier observes wrong product behavior: preserve expected results, return
  `product-failure` and hand the symptom/evidence to `debugging-phase` through the caller.

Clean owned residue after failed iterations and teardown after the last drive, including
re-proofs. Preserve evidence outside cleanup targets. Reread every changed file, verify
unrelated bytes, and recheck source/runtime identities before returning.

## Return one outcome

Return exactly one of `unchanged`, `updated`, `blocked`, `product-failure`:

- `unchanged`: selected executable knowledge was current and its live path is proved.
- `updated`: selected corrections and each changed drive path are live-proved, obsolete
  references reconciled, and unrelated content preserved.
- `blocked`: required coverage/proof cannot finish; name attempted action, failure,
  recovery and exact missing prerequisite. Keep original scenario/criteria blocked.
- `product-failure`: current instructions expose a product regression; retain failure
  and downstream proof for debugging without rewriting expected behavior.

Include original scenario/criteria, covered paths, source citations, changed/retired
paths, preservation comparison, authority/code/runtime/scenario identities, proof
locations, cleanup result and blockers. `unchanged` and `updated` return control to the
original scenario; they do not classify its acceptance. `implement-spec` reuses proof
only when all four identities and the required scenario obligations match, otherwise
runs missing proof. Keep concise run notes outside committed verifier content; no
separate maintenance PR or broad Feature Map regeneration is required.
