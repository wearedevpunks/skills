# Spec Phase

Use this phase when no matching agent-ready `SPEC.md` exists, or the current
spec is stale, contradictory, or missing required scope.

## Delegate

Load `create-spec` only after this phase is selected.

## Checks Before Delegating

- Confirm the bounded goal, issue, tracker item, or requested capability.
- Reuse existing spec artifacts when they match the requested scope.
- Treat child stories, sub-issues, acceptance criteria, constraints, and non-goals as required input, not loose references.
- If requirements are unsettled, return the compiler's `spec-not-ready` result
  and route each named gap upstream instead of interviewing here.

## Completion State

Write or verify:

- matching `SPEC.md`
- `readiness: agent-ready`
- `spec-written`
- source issue/tracker/spec folder

Then stop or re-enter `delivery-phase` for routing.

This completion state satisfies the downstream spec gate. Do not add a spec
review or approval stop unless the user explicitly requested a HITL checkpoint.
