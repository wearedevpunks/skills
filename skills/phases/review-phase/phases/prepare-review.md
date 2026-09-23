# Prepare Review Gate

## Entry Guard

The router selected this gate from fresh `review_due` evidence supplied by an
authorized full-delivery or explicit-operator invocation. The review mode is `delivery` or `standalone`,
and no valid later-state evidence already owns the run.

## Inputs

- explicit invocation context and mode
- accepted-bounds identity, scope, and primitive evidence
- delivery Git/diff or standalone artifact target primitives
- governing Spec, Standards, scoped guidance, named-skill, plan, and
  implementation-note sources; retained Architecture for delivery mode
- delivery-goal identity and retained-report candidates for delivery mode
- caller evidence needed to explain a retry, failure, or current route

## Actor-Like Gate Boundary

This gate owns admissibility, normalization, identity derivation, delivery
budget recovery, and freezing the review inputs. A narrower target or hashing
executor may collect bytes and compute candidate values. This gate validates
those results against [`../references/targets.md`](../references/targets.md),
reconciles retained-pass recovery, and owns the exit evidence.

## Bounded Action

1. Validate accepted bounds and normalize the smallest-certain supported target
   before reading or evaluating any delivery review counter. Unsupported target
   or invalid bounds evidence is terminal even when a delivery counter is 2 or a preserved legacy 3.
2. For delivery mode, verify the
   [Architecture/SPEC pair](../../delivery-phase/references/artifact-state.md#architecturespec-pair-complete)
   before review preparation continues. Missing, stale or conflicting proof returns
   `review_context_blocked` with the exact gap for Requirements Phase /
   `requirements-grill`, preserving lineage and completed ordinals. Include the
   architecture's exact retained identity and required decision selectors in
   governing sources and Review Packet facts; use existing source-set hashing.
   Recompute the accepted-bounds hash, normalized target, inclusive scope,
   snapshot hash, governing source paths and blob hashes, and source-set hash
   from primitive current evidence.
3. Derive delivery lineage only from stable delivery-goal identity. Derive
   standalone lineage from target locator and accepted-bounds hash. Standalone
   mode reads and writes no delivery review or repair counter.
4. For delivery mode only, recover `review_count` from unique valid retained
   ordinals for this lineage and reconcile contradictory projections from that
   authority. Call `planDeliveryReviewGate` in
   [`review-contract.mjs`](../scripts/review-contract.mjs) with `currentState`,
   `acceptedBoundsValid`, `targetSupported`, and `recoveredReviewCount`.
   At count one, pass `acceptedRiskTrigger: { kind, evidence }` only for a
   parent-accepted repair; `evidence` points to its accepted change and the kind
   uses this exact mapping:

   | Accepted change | `kind` |
   | --- | --- |
   | Architecture or ownership boundary | `architecture` |
   | Security or authorization | `security` |
   | Public contract | `public_contract` |
   | Runtime or deployment topology | `runtime_topology` |
   | Accepted scope | `accepted_scope` |

   At count two or higher, an additional pass requires the parent-verified
   `humanReviewDirection: { evidence, authorized_ordinal }` described in
   [Review Packet](../references/review-packet.md). Its ordinal must equal
   `recoveredReviewCount + 1`; pass the identical verified object to retention
   and retain it as `review_epoch.human_direction`. It never resets lineage or
   counters. Reusing direction for a different ordinal fails the guard.
   Continue preparation only when the helper returns `review_due`. Return its
   `focused_validation` outcome to delivery for ordinary after-pass repair, or
   its terminal zero-write `review_budget_exhausted` outcome when allowance is
   exhausted. Both preserve the current route, retained evidence and counters.
5. After admissibility and the delivery budget guard pass, freeze the normalized
   target bytes and governing source bytes. In delivery mode preallocate ordinal
   `recovered review_count + 1` and derive `review_run_id` from lineage and that
   ordinal. In standalone mode derive `review_run_id` from lineage and
   `snapshot12`.
6. Freeze the [Review Packet](../references/review-packet.md), including
   Architecture for delivery mode, Spec, plan, skill guidance, Verification
   evidence and relevant dependency pointers.
   Assemble complete `review_running` predecessor evidence. Preparation ends
   before any review lens, validation command, report write, retention action,
   counter projection, or repair routing.

## Invariants

- Target and bounds validity precede every delivery-budget decision.
- A delivery ordinal is preallocated only after `planDeliveryReviewGate` returns
  `review_due`: first pass, accepted-risk second pass, or the exact
  human-authorized additional ordinal.
- Preallocation changes no completed-pass counter.
- One run identity names exactly one frozen target and governing source set.
- Full-repository scope exists only when the caller explicitly requested it.
- Standalone mode has no delivery-budget effect.
- Preparation mutates neither the reviewed target nor report/navigation/wiki-log
  paths.

## Completion Evidence

Preparation is complete only when the gate can return all of:

- mode, lineage, run identity, and delivery ordinal or standalone null
- accepted-bounds identity and recomputed hash
- exact normalized target and inclusive scope
- snapshot hash, `snapshot12`, and frozen target evidence locator
- governing source paths, individual hashes, source-set hash, and frozen source
  evidence locator
- recovered delivery count and its authoritative retained-pass evidence, or
  standalone null
- one declared exit with exact validation, failure, or blocker evidence

## Declared Exits

- `focused_validation`: ordinary accepted repair after a completed pass; return
  the helper result to the delivery caller without opening a review run or
  changing report, handoff or counter authority.

- `review_running`: admissibility passed, delivery budget remains, and the frozen
  target/source predecessor evidence is complete. Re-enter the router.
- terminal `review_budget_exhausted`: valid delivery context recovered count 2
  or greater without verified direction for the next ordinal. Return exact current-route evidence with no report, counter,
  handoff, or status write.
- terminal `review_failed`: unsupported target, invalid accepted bounds, or a
  non-retryable normalization, identity, or recovery contract failure. Return
  exact evidence with no report or counter change.
- `review_due`: retryable infrastructure or partial preparation failure. Return
  exact evidence with no report or counter change.
- blocked `review_context_blocked`: a required primitive cannot be reconstructed
  safely. Name the missing evidence and stop.

## Durable Handoff

Load [the runtime handoff contract](../references/runtime-handoff.md). Persist
every stateful exit with its exact schema and mode-specific storage. Use its
pre-storage failure or blocker exception only when lineage, run identity, or a
safe handoff path cannot be established.

`focused_validation` and `review_budget_exhausted` are declared pre-run
zero-write returns: preserve the
caller-provided delivery handoff and retained-count authority unchanged, then
return the required identity, count, and current-route evidence directly.

## Stop Or Router Re-entry

Stop on terminal or blocked exits. Otherwise stop after the gate-local outcome,
or re-enter [`router.md`](router.md). Load no sibling gate directly.
