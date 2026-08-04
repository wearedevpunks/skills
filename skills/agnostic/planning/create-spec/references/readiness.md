# Readiness

Compile only when the decision frontier is closed or every remaining item is
explicitly parked with owner and resume trigger.

Required inputs:

- actor, outcome, capability boundary, non-goals, and constraints
- accepted functional behavior and observable success
- accepted implementation and testing decisions, when any were made upstream
- every applicable prototype verdict by immutable commit SHA and path
- a verification-seam decision, or an explicit not-applicable rationale
- dependency readiness for every declared dependency: proven landed, or an
  accepted branch/base intent with concrete evidence; blocked or unevidenced
  dependencies fail compilation

Validate the compiled traceability graph before writing:

- every `US-###` has at least one `AC-###` whose `Covers` list names it
- every `Covers` reference resolves to an existing `US-###`; a reference to a
  nonexistent `US-###` fails compilation
- identifiers are unique and coverage is one-way from acceptance criterion to
  user story

On failure, return one `spec-not-ready` result listing every missing decision or
evidence item and its upstream route: `finder-phase`, `parallel-research`,
`prototype-phase`, or `requirements-grill`. Write no partial spec.
