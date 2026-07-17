# Grill Phase

Run a lean requirements-grill only after intake evidence exists.

## Delegation

Activate `requirements-grill` from this phase only.

## Scope

Grill only:

- goals
- user-visible page or flow scope
- constraints
- conflicts with existing system evidence
- hard requirements
- content ownership
- target surface
- non-negotiables
- artifact intent: image references or prototype artifacts

Default to one branch per user-visible page or flow. Use section-level branches only when the section is an independent decision surface.

## Rules

- Do not grill detailed UI choices that prototype work should discover.
- Prefer existing design-system evidence over new taste preferences.
- Stop when accepted constraints and artifact intent are clear enough for artifact production.

## Output

- Accepted constraints by scope unit.
- Rejected or superseded constraints.
- Open conflicts or parked scope.
- Artifact intent per scope unit.
- After `$requirements-grill` completes, phase handoff with next route: prototype.
