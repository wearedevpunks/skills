# Quality Gate

## Entry Guard

Enter only when the router selected this gate: the open round is fully built
and a variant lacks a quality result for its current build.

## Inputs

- the open round record: variant ids, `?variant=` URLs, build identities
- Motion Plan entries in state `built` for this round
- DESIGN.md and accepted constraints
- [the copy lens](../references/copy-lens.md)

## Actor-Like Gate Boundary

Quality-gate owns the per-variant quality results and the Motion Plan
`verified` state. It delegates checks to `break-ui`, `mobile-native`, and
`review-animations`, and keeps the pass/fail decision and the handoff write.
Fixes belong to `variant-round`.

## Bounded Action

Run every check on every variant that lacks a result for its current build:

1. Light `break-ui`: its map, worst-case, toggle, and break phases with one
   worst-case dataset, swapped at the data boundary behind its dev-only
   toggle, checked at 375px and 1280px. Pass: zero open "What broke" items.
   Record every "Decision for you" on the variant.
2. `mobile-native` checklist (web): its "Never Ship" table and symptom table.
   Pass: no listed defect is present. Record its "What needs a phone" items.
   Expo: record the check as not applicable.
3. `review-animations` on the variant's motion. Pass: its decision is
   Approve.
4. [The copy lens](../references/copy-lens.md) on every visible string.
   Pass: zero hits.
5. Motion Plan conformance: each `built` entry for this variant matches its
   location, properties, curve, duration, and reduced-motion handling. Pass:
   every entry matches; set each matching entry to `verified` for this
   variant.

Record pass or fail per check per variant, with evidence for every failure. A
variant passes only when all five checks pass.

## Invariants

- Only variants whose latest result is pass reach the Verdict.
- The checks read the variants; variant code stays unchanged.

## Completion Evidence

- a result for every check on every variant of the current build
- failure evidence with location for each fail
- Motion Plan entries set to `verified`

## Declared Exits

- `complete` `round_passed`: every variant passes; next route `verdict`.
- `complete` `variants_failed`: one or more variants fail; next route
  `variant-round` for repair in the same round.
- `blocked` `quality_check_unavailable`: a check cannot run (for example, the
  dev server does not start); the record names the check and the evidence.
- `human_steering_required`: a check result requires a decision outside the
  accepted constraints; the record names the decision needed.

## Durable Handoff

Write the quality results into the Round State, the Motion Plan changes, and
one gate outcome through [the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After a `complete` exit, re-enter [`router.md`](router.md). On a blocked or
steering exit, stop.
