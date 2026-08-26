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

Technical Finder adds one conditional input: the exact selected Story context
established by its accepted Functional child. Non-Finder compilation has no
provider Story precondition.

## Dependency output contract

Serialize both sections in every compiled spec:

- `Dependency Readiness`: write `No Stack Required` when no dependency exists.
  Otherwise write `Ready` and list every dependency with immutable landing or
  branch/base evidence.
- `Branch/Base Intent`: when accepted intent exists, record the intended parent
  or base, child branch constraint, and supporting evidence. Otherwise write
  `Not applicable` explicitly.

Never emit `Blocked` with `readiness: agent-ready`; blocked or unevidenced
dependencies produce `spec-not-ready` instead.

Validate the compiled traceability graph before writing:

- every `US-###` has at least one `AC-###` whose `Covers` list names it
- every `Covers` reference resolves to an existing `US-###`; a reference to a
  nonexistent `US-###` fails compilation
- identifiers are unique and coverage is one-way from acceptance criterion to
  user story

On failure, return one `spec-not-ready` result listing every missing decision or
evidence item and its upstream route: `finder-phase`, `parallel-research`,
`prototype-phase`, or `requirements-grill`. Write no partial spec.
