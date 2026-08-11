# Run Review Gate

## Entry Guard

The router selected this gate from complete fresh `review_running` predecessor
evidence. One normalized target, snapshot hash, governing source set, lineage,
and run identity are frozen and mutually consistent.

## Inputs

- the prepared mode, lineage, run identity, and delivery ordinal when applicable
- frozen normalized target bytes, inclusive scope, and snapshot hash
- frozen governing source bytes and source-set hash
- accepted Spec or standalone bounds, Standards, nearest scoped guidance, and
  every named skill
- plan `assigned_skills` and `implementation_skill_guidance`, plus
  `IMPLEMENTATION-NOTES.md` skill evidence and validation requirements
- any accepted broader-check authority from the governing spec or plan

## Actor-Like Gate Boundary

The parent review gate owns the single review run, candidate reconciliation,
finding acceptance, validation safety, report assembly, and every exit. It may
delegate advisory generation and independent lenses to narrower readonly
executors. Every executor receives the same frozen snapshot identity and bounded
scope; the parent rejects stale, expanded, duplicated, or unverified output.

## Bounded Action

1. Recompute the frozen target and source hashes before dispatch. A mismatch
   makes the prepared evidence stale and returns to `review_due`.
2. Invoke `autoreview` exactly once as advisory candidate generation for this
   frozen snapshot. A ClawPatch helper, when present, remains internal to that
   one advisory call and consumes no additional review pass.
3. Run all five normative lenses against the same snapshot as independent
   bounded work, in parallel when executors are available:
   - Standards
   - skill adherence and scoped skills
   - architecture
   - simplify
   - Spec
4. Keep Standards and Spec as distinct axes. Standards and skill adherence,
   architecture, simplify, then Spec controls report and triage order only; it
   does not serialize the lenses or change severity.
5. For skill adherence, prove every implementation-applicable
   `assigned_skills` item maps to exactly one guidance entry and every guidance
   entry maps to exactly one implementation-note evidence record. Verify every
   `loaded`, `applied`, and `not_applicable` claim, including its how/where or
   why/where evidence, against frozen changed artifacts. Missing, extra, or
   contradicted evidence becomes a finding.
6. Parent-verify every advisory and lens candidate against the frozen target and
   adjacent evidence. Only verified candidates become findings. Give each
   accepted finding a stable identifier, lens, severity, location, impact,
   evidence, and action.
7. Run only the smallest safe readonly validation needed to verify candidates or
   governing acceptance evidence. Broader checks require explicit accepted spec
   or plan authority. Record missing required RED/GREEN evidence as a finding;
   this gate does not create it.
8. Record the frozen-target hash before and after every validation. Proven
   no-write commands may use the reviewed checkout. Commands that may write
   caches, generated files, snapshots, lockfiles, or state run in a disposable
   checkout or snapshot rooted at the frozen revision. Reconcile exact commands,
   isolation mode, hashes, output, skipped checks, and residual risk.
9. Derive the report route from verified findings: runtime evidence first,
   otherwise an in-scope non-runtime blocker, otherwise broad architecture debt,
   otherwise documentation ingest or closeout by documentation completeness.
   Architecture debt may remain a secondary follow-up.
10. Assemble exactly one complete local report using
    [`../references/durable-report.md`](../references/durable-report.md). Record
    an explicit outcome for every lens. After its final bytes are written, treat
    the local report as immutable and end this gate before retention.

## Invariants

- One gate run inspects exactly one frozen bounded snapshot.
- `autoreview` runs exactly once; the five normative lenses each run exactly
  once against the same snapshot.
- Advisory output never bypasses parent verification.
- Standards and Spec remain distinct report sections.
- Validation is readonly relative to the frozen target and remains within
  accepted bounds.
- A before/after target-hash mismatch invalidates every result and local report
  from this attempt and consumes no pass.
- The reviewed target remains unchanged. The only allowed write is the local
  immutable report; navigation, wiki-log, commit, push, and counter projection
  belong to retention.
- This gate plans no work, assigns no implementation skills, creates no missing
  implementation evidence, repairs no finding, and opens no repair state.

## Completion Evidence

The run is complete only when one local report contains:

- the prepared lineage, run, bounds, normalized-target, snapshot, source-set,
  and mode-specific delivery identities
- explicit Standards, skill-adherence, architecture, simplify, and Spec outcomes
- every verified stable finding and no unverified advisory candidate
- evidence-cardinality results for all applicable skill guidance and notes
- exact validation commands, isolation, before/after hashes, outcomes, skipped
  checks, and residual risk
- report-derived primary routing and optional secondary architecture follow-up
- the immutable report path and local report SHA-256

## Declared Exits

- `report_retention_pending`: the complete immutable local report exists and its
  target/source hashes remain fresh. Re-enter the router.
- `review_due`: target or source freshness changed, validation mutated the
  frozen target, or a retryable infrastructure/partial-run failure occurred.
  Discard any local report authority and consume no pass.
- terminal `review_failed`: a non-retryable review, validation-isolation, or
  report-contract failure occurred. Return exact evidence with no authoritative
  report or counter change.
- blocked `review_context_blocked`: required frozen evidence became unavailable
  and cannot be reconstructed without a new preparation attempt. Name it and
  stop.

## Durable Handoff

Load [the runtime handoff contract](../references/runtime-handoff.md). The gate
has valid lineage, run identity, and storage on entry, so every declared exit
writes its exact stateful record before stop or router re-entry.

## Stop Or Router Re-entry

Stop on terminal or blocked exits. For `review_due` or
`report_retention_pending`, stop after the gate-local outcome or re-enter
[`router.md`](router.md). Load no sibling gate directly and perform no repair.
