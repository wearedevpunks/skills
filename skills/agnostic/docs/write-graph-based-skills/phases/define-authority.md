# Define Evidence Authority

## Selection Condition

Select when the state model exists and evidence authority, admissibility, overlapping-guard precedence, or deterministic tie-breaks remain incomplete.

## Bounded Work

- Update [Transition Guards and Precedence](../references/authoring-contract.md#transition-guards-and-precedence).
- Apply this authority order: current direct evidence, fresh valid in-scope workflow-native artifacts, latest committed handoff, suggested route.
- Define freshness, scope, and validity checks for each transition.
- Audit overlapping guards and assign deterministic precedence until every legal conflict selects one route.

## Checkable Completion State

- Every ambiguous eligibility set resolves to exactly one route.
- Stale, out-of-scope, and invalid evidence loses eligibility.
- Every overlap has an explicit precedence or tie-break rule.

## Durable Phase Outcome

Update the `define-authority` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the authority artifact, separate conflict checks, blockers, and any unresolved overlap.

## Stop or Re-entry

Stop after writing the outcome, or re-enter root. Do not load another phase directly.
