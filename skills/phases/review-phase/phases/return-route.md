# Return Route

## Entry Guard

Enter only when the router selected this gate from one unique, fresh, valid
retained pass and no durable returned-routing outcome exists for its run. The
retained report is the only finding and routing authority.

## Inputs

- exact retained report bytes, path, SHA-256, commit, and retained ref
- approved-path and ref-containment evidence
- primitive target, accepted-bounds, and governing-source evidence for one
  final freshness check
- caller mode and the report's lineage, run ID, findings, routing object, and
  validation evidence

Load [the report evidence contract](../references/durable-report.md) and use
[`review-contract.mjs`](../scripts/review-contract.mjs) to validate the retained
pass before deriving an output.

## Actor-Like Gate Boundary

The return gate owns retained-pass revalidation, deterministic route
derivation, consistency checking, and the returned-routing handoff. It may use
a readonly validator. It delegates no delivery transition and owns no repair,
debug, debt, documentation, or closeout work.

## Bounded Action

1. Revalidate the retained blob, canonical identities, approved commit paths,
   same-run uniqueness, ref containment, and current freshness. Reuse only the
   immutable authority block inside those retained bytes.
2. Pass the complete retained finding set to the public `deriveReviewRouting`
   helper. Each non-empty finding already carries one validated `return_route`.
   The helper applies `human_steering_required` > `debugging` >
   `implementation` > `debt_follow_up` > `docs_ingest`; an empty set returns
   `closeout`.
3. Accept `secondary_architecture_follow_up` only when a `debt_follow_up`
   finding accompanies a higher-priority debugging or implementation route.
4. Require the derived result to equal the retained report's `routing` object.
   A mismatch is invalid retained routing evidence and routes to
   `review_failed`.
5. If the primary route is `human_steering_required`, invoke `$handback`, write
   its durable outcome, and stop.
6. Otherwise write returned routing evidence containing the immutable report
   identity, stable finding IDs, primary route, optional architecture follow-up,
   and validation summary. Delivery returns `review_routed`; standalone returns
   `review_complete`.

## Invariants

- Findings and routing come strictly from the retained report. Current delivery
  state, caller preference, and later unreviewed changes cannot rerank them.
- Human steering outranks runtime, implementation, debt, documentation, and
  closeout.
- The retained report and reviewed target remain readonly.
- This gate writes routing or `$handback` evidence only. Delivery owns any later
  route mutation and every repair counter or active repair state.
- One return does not invoke review again, run validation again, create review
  4, or enter repair.

## Completion Evidence

- valid retained-pass result and final freshness result
- retained report path, SHA-256, commit, and containing ref
- stable finding IDs and their explicit `return_route` classifications
- deterministic precedence result and exact match to report `routing`
- returned mode-specific state and routing-evidence artifact

## Declared Exits

- `review_routed`: delivery-mode routing evidence is durable and ready for an
  explicit delivery resume.
- `review_complete`: standalone routing evidence is durable and review is
  complete.
- `human_steering_required`: the `$handback` outcome is durable and expanded
  repair awaits that skill's authority guard.
- `report_retention_pending`: retained containment or blob evidence became
  temporarily unverifiable; retry retention without rerunning lenses.
- `review_due`: target, bounds, or governing sources are no longer fresh for
  this return.
- `review_failed`: the retained pass, uniqueness, or derived routing contract is
  invalid or failed non-retryably.

## Durable Handoff

Load [the runtime handoff contract](../references/runtime-handoff.md). Every new
declared exit writes its exact stateful record, including route output fields
inside `Artifacts`. Rediscovery of an identical already-recorded return is the
contract's idempotent no-write terminal.

## Stop Or Router Re-entry

Return the durable routing evidence and stop. A delivery caller resumes
`delivery-phase` explicitly; this gate never performs that transition. Re-enter
[`router.md`](router.md) only for a declared nonterminal exit, never by loading
a sibling gate directly.
