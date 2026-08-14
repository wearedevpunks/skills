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
  implementation-note sources
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
   or invalid bounds evidence is terminal even when a delivery counter is 3.
2. Recompute the accepted-bounds hash, normalized target, inclusive scope,
   snapshot hash, governing source paths and blob hashes, and source-set hash
   from primitive current evidence.
3. Derive delivery lineage only from stable delivery-goal identity. Derive
   standalone lineage from target locator and accepted-bounds hash. Standalone
   mode reads and writes no delivery review or repair counter.
4. For delivery mode only, recover `review_count` from unique valid retained
   ordinals for this lineage and reconcile contradictory projections from that
   authority. When the recovered count is at least 3, return the terminal
   zero-write `review_budget_exhausted` result with exact current-route evidence.
5. After admissibility and the delivery budget guard pass, freeze the normalized
   target bytes and governing source bytes. In delivery mode preallocate ordinal
   `recovered review_count + 1` and derive `review_run_id` from lineage and that
   ordinal. In standalone mode derive `review_run_id` from lineage and
   `snapshot12`.
6. Assemble complete `review_running` predecessor evidence. Preparation ends
   before any review lens, validation command, report write, retention action,
   counter projection, or repair routing.

## Invariants

- Target and bounds validity precede every delivery-budget decision.
- A delivery ordinal is preallocated only after recovered `review_count < 3`.
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

- `review_running`: admissibility passed, delivery budget remains, and the frozen
  target/source predecessor evidence is complete. Re-enter the router.
- terminal `review_budget_exhausted`: valid delivery context recovered count 3
  or greater. Return exact current-route evidence with no report, counter,
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

`review_budget_exhausted` is the declared zero-write no-op: preserve the
caller-provided delivery handoff and retained-count authority unchanged, then
return the required identity, count, and current-route evidence directly.

## Stop Or Router Re-entry

Stop on terminal or blocked exits. Otherwise stop after the gate-local outcome,
or re-enter [`router.md`](router.md). Load no sibling gate directly.
