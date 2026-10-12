# Spec Phase

Use this phase when the required Architecture/SPEC pair or its backlog
projection is missing, stale or conflicting. Apply the
[Architecture/SPEC Pair Complete gate](../references/artifact-state.md#architecturespec-pair-complete)
and the
[Backlog Projection Complete gate](../references/artifact-state.md#backlog-projection-complete).

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

## Delegate

Return the bounded goal, exact artifact/decision gap and current source pointers
to Requirements Phase. It owns `requirements-grill -> create-architecture ->
create-spec -> write-backlog`. Pass optional Finder context only when supplied.
Reuse matching current retained artifacts; unsettled decisions return to
`requirements-grill` before either compiler runs.

## Completion State

Verify the retained Architecture/SPEC pair and its exact identities, verified
immutable blob URLs and source selectors. Backlog projection must name that
spec identity and satisfy the Backlog Projection Complete gate. Compiler
readiness needs no additional approval gate.

Emit the [common Phase Result](../references/context-continuity.md#common-phase-result)
with pointers to the resulting proof or exact gap. Continue only in Full
Delivery; otherwise stop at the requested boundary.
