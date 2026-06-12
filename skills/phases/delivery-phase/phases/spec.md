# Spec Phase

Use this phase when no reviewed matching `SPEC.md` exists, or the current spec is
stale, contradictory, or missing required scope.

## Delegate

Load `create-spec` only after this phase is selected.

## Checks Before Delegating

- Confirm the bounded goal, issue, tracker item, or requested capability.
- Reuse existing spec artifacts when they match the requested scope.
- Treat child stories, sub-issues, acceptance criteria, constraints, and non-goals as required input, not loose references.
- If requirements are still unsettled, stop and route to requirements work instead of inventing scope.

## Completion State

Write or verify:

- matching `SPEC.md`
- review status or explicit human approval state
- unresolved questions, if any
- source issue/tracker/spec folder

Then stop or re-enter `delivery-phase` for routing.
