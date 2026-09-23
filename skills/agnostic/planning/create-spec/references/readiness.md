# Readiness

Compile only when the decision frontier is closed and every remaining item is
explicitly parked with an owner and resume trigger.

Required inputs:

- current retained sibling `ARCHITECTURE.md` satisfying the
  [architecture artifact contract](../../create-architecture/references/artifact-contract.md),
  with `status: compiled`, `readiness: agent-ready`, verified immutable blob URL
  and exact identity; its capability, grill status/log, glossary and referenced
  evidence must match the current confirmed sources
- actor, outcome, capability boundary, non-goals, and constraints
- accepted functional behavior and observable success
- accepted implementation and testing decisions, when any were made upstream
- every applicable prototype verdict by immutable commit SHA and path
- verification-seam decision, or an explicit not-applicable rationale
- dependency readiness for every declared dependency: proven landing, or an
  accepted branch/base intent with concrete evidence; blocked or unevidenced
  dependencies fail compilation

Provider backlog items may supply evidence. Compilation never requires a
preselected provider delivery item.

## Architecture source and traceability contract

Before compiling, verify the retained architecture commit/ref, blob URL and
bytes. Resolve its source identities and decision selectors against the current
confirmed grill status/log; a timestamp or stored URL alone proves no freshness.
Missing, stale or conflicting architecture produces `spec-not-ready` with the
exact gap routed to Requirements Phase / `requirements-grill`. Preserve the
existing canonical pair until both proposed artifacts and their mapping agree.

Read the [Spec traceability contract](../../create-architecture/references/artifact-contract.md#spec-traceability).
An initial architecture may have a pending map because the spec does not exist
yet. Draft real `OUT-###` and `AC-###` identities before completing that map in
`ARCHITECTURE.md`. Preserve existing codes when their meaning is unchanged;
retire superseded codes explicitly and never reuse them for another requirement.
Every outcome and criterion must resolve through the canonical mapping to stable
architecture selectors and exact source Q/log-entry evidence anchors. Follow the
contract's justified no-structural-counterpart rule where applicable. Never
invent a question, design decision or rationale to fill a row.

The amendment changes traceability metadata only. Pending, dangling, stale,
unsupported or incomplete mappings block `spec-written` and downstream handoff.
Resolve the whole proposed pair before writes, retain the enriched architecture,
then bind its final immutable blob URL, commit, path and content identity in the
spec's `Architecture Source` and frontmatter `links`. Retain the spec afterward.
Architecture uses spec codes as lookup keys, without a reverse immutable spec
identity or a link into a future commit. Return both immutable URLs as the pair.

Give each outcome and criterion a backlink to `#spec-traceability` labeled with
its spec code, plus links to the relevant architecture selectors. Keep the many-to-many map in architecture;
backlinks in the spec are navigation, not a competing mapping table. Preserve
applicable source-question IDs and decision selectors beside accepted constraints
and technical decisions, including exact accepted libraries/versions, helpers,
APIs/paths, algorithms, configuration and protocols. Link the companion's narrative
and diagrams instead of copying them. Retain confirmed rationale; never infer it.

## Dependency output contract

Serialize both sections in every compiled spec:

- `Dependency Readiness`: write `No Stack Required` when no dependency exists.
  Otherwise write `Ready` and list every dependency's immutable landing or
  branch/base evidence.
- `Branch/Base Intent`: when accepted intent exists, record the intended parent
  or base, child branch constraint, and supporting evidence. Otherwise write
  `Not applicable` explicitly.

Never emit `Blocked` with `readiness: agent-ready`; blocked or unevidenced
dependencies produce `spec-not-ready` instead.

## Outcome coverage contract

Validate the compiled traceability graph before writing:

- every unique `OUT-###` has at least one `AC-###`
- every `Covers` reference resolves to an existing `OUT-###`
- all `OUT-###` and `AC-###` identifiers are unique
- coverage is one-way from each acceptance criterion to its covered outcome;
  outcomes do not identify or prescribe provider delivery items

On failure, return one `spec-not-ready` result listing every missing decision or
evidence item and its upstream route: `finder-phase`, `parallel-research`,
`prototype-phase`, or `requirements-grill`. Write no partial spec.
