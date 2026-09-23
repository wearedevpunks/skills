# Spec Phase

Use this phase when the required Architecture/SPEC pair is missing, stale or
conflicting. Apply the
[Architecture/SPEC Pair Complete gate](../references/artifact-state.md#architecturespec-pair-complete).

## Delegate

Return the bounded goal, exact artifact/decision gap and current source pointers
to Requirements Phase. It owns `requirements-grill -> create-architecture ->
create-spec -> write-backlog`. Pass optional Finder context only when supplied.
Reuse matching current retained artifacts; unsettled decisions return to
`requirements-grill` before either compiler runs.

## Completion State

Verify the retained Architecture/SPEC pair and its exact identities, verified
immutable blob URLs and source selectors. Backlog projection must name that
spec identity. Compiler readiness needs no additional approval gate.

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to the resulting proof or exact gap. Continue only in Full
Delivery; otherwise stop at the requested boundary.
