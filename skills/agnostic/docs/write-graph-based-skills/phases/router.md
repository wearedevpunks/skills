# Authoring Router

## Selection Condition

Load this file on every invocation and re-entry before any authoring phase. Resume from current target artifacts and evidence without relying on transcript continuity.

## Bounded Work

1. Inspect the target `SKILL.md`, flat `phases/` directory, operational references, and `<target-skill>/AUTHORING-HANDOFF.md`.
2. Treat current direct evidence and fresh valid target artifacts as authoritative. Treat recorded outcomes as supporting evidence and route suggestions as advisory.
3. Reuse fresh, complete, consistent artifacts.
4. Select the earliest missing, stale, or contradictory phase:
   - unresolved bounds -> `qualify.md`
   - incomplete state model -> `model-state.md`
   - incomplete authority rules -> `define-authority.md`
   - missing or invalid target bootstrap/router -> `write-router.md`
   - missing or invalid target gate files -> `write-phases.md`
   - incomplete handoff contract -> `define-handoffs.md`
   - invalid disclosure or unreachable pointers -> `verify-disclosure.md`
   - incomplete or mismatched route tests -> `test-routes.md`
   - incomplete terminal audit -> `audit.md`
5. When guards overlap, apply the declared evidence authority and deterministic precedence before selecting.

## Checkable Completion State

- Exactly one phase filename, one blocked outcome, or the audit-complete terminal is selected.
- The selection cites current evidence and explains every resolved overlap.
- Every selected filename exists under this skill's `phases/` directory.

## Durable Phase Outcome

Update the `router` entry in `<target-skill>/AUTHORING-HANDOFF.md` with the inspected artifacts, separate validation evidence, blockers, unresolved obligations, and the selected phase or terminal. The selected phase remains advisory until root re-entry confirms it from current evidence.

## Stop or Re-entry

Return the selection to root. Root loads exactly one selected phase. Stop on blocked or audit-complete outcomes.
