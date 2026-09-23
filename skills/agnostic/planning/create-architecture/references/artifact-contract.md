# Architecture Artifact Contract

The single consumer contract for `create-architecture`, `create-spec`, planning,
implementation, and delivery. Read it when compiling, consuming, refreshing, or
checking `ARCHITECTURE.md`.

## Identity and authority

The artifact is
`<resolved-specs-root>/<domain>/<topic>/ARCHITECTURE.md`, using
[create-spec's folder rules](../../create-spec/references/folder-naming.md).
Its capability identity is the resolved folder plus the accepted capability
boundary. Updating an existing folder requires both to match current inputs.

The required flow is `requirements-grill -> create-architecture -> create-spec ->
write-backlog`. Architecture compiles before `SPEC.md` exists. An absent spec
cannot block architecture compilation; record its intended sibling path as text.
When a spec exists, check agreement; add a sibling link only when its target
exists in the retained architecture tree. Explicit source supersession
allows architecture to refresh first; report the exact stale spec constraints for
subsequent spec refresh. An unexplained conflict remains a decision gap.

The grill log records decisions; the status records current closure, grounding,
and glossary. Architecture explains those decisions across system levels.
`SPEC.md` remains the authority for resolved requirements, outcomes, and acceptance
criteria. It must incorporate accepted constraints, not merely link architecture.
Both artifacts must agree with current grill evidence. A conflict returns to
`requirements-phase` / `requirements-grill`; neither artifact silently overrides
the other. Architecture creates no new acceptance criteria or approval gate.
`create-plan` owns task choreography, worker assignments, edit lists, and commands.
Accepted implementation paths and APIs remain architecture evidence, not tasks.

`status: compiled` and `readiness: agent-ready` describe compiler readiness.
They imply neither human approval nor implemented behavior. Artifact frontmatter
alone is insufficient for handoff: the retention and freshness checks below must
also pass. Honor an explicitly requested human checkpoint without adding one.

## Source readiness

Resolve the installed `requirements-grill` skill and read its
`references/artifact-output.md`; read status, then log under that contract.
For the accepted in-scope branches require:

- closed decisions, explicit shared-understanding confirmation, grounded
  technical branches, and no unanswered material question or open decision;
  percentages, timestamps, a candidate, or an `answered` label alone do not prove
  closure;
- matching current status, durable decisions, glossary terms, relationships,
  axioms, and explicit supersession; preserve stable `Q<N>` IDs and distinguish
  superseding entries by their anchors;
- retrievable evidence for every accepted claim that depends on it, including
  accepted dependency, prototype, interface, and implementation constraints;
- any excluded parked/deferred item explicitly outside current scope, with owner
  and resume trigger. Parking cannot hide an unresolved in-scope guarantee.

Record exact locations and content identities for status, log, glossary, and
each used evidence source: repository/path or URL, section/symbol/question anchor,
and immutable revision or content hash. A glossary embedded in status uses that
file's identity plus its glossary anchor. Identify any separately published
glossary and reconcile it with the current accepted terms. Record evidence as
observed current behavior or accepted design; neither proves the other.

Track source disposition truthfully: `accepted`, `superseded`, `parked`, or
`unknown`. A candidate is `unknown` acceptance, never accepted by the compiler.
Preserve explicit replacement links for superseded decisions. A missing version
or rationale that was never provided is `not recorded`, not an invented value
or automatic blocker. Required missing evidence, contradictions, or a newly
exposed material decision do block readiness.

Resolve the installed `brainstorm` skill and read its canonical **Flow failure
lenses**; use its exact lens labels in the artifact's coverage rows. Each row records grounded evidence,
an explicit unknown, or a justified not-applicable result. For an unknown, name
the guarantee at stake and whether it is material to the accepted scope.
Non-material unknowns remain visible; material unresolved guarantees block.

## Exact decision coverage

For every current accepted decision, map its question ID and evidence anchor to
a concrete architecture section, detail, and applicable visual. Use separate rows
when one answer contains several choices. Preserve supplied library and version,
helper/API name and path, algorithm, configuration key/value, protocol, ordering,
limits, alternatives, and rationale. Preserve exact canonical glossary terms.

A broad summary or source link alone is not coverage. Include the actual accepted
detail in the architecture and connect it to the owner, state, boundary, flow, or
system constraint it serves. Record `not recorded` for unprovided rationale or
version when relevant. A superseded choice belongs in disposition history, never
in the current design. A parked choice remains outside the active design.

Each visual preserves accepted/current/unknown distinctions and source ordering.
Place its source anchors and a causal plain-language conclusion beside it.
Record the actual Mermaid parser/render check, or the unavailable-check limit;
a successful source read is not a successful render.

## Spec traceability

Architecture owns the mapping from each spec code to design and grill evidence.
Give addressable architecture blocks stable `ARC-###` selectors; give flows stable
`FLOW-###` selectors and addressed steps `FLOW-###-STEP-###` selectors. Use
`DEC-###` for an accepted detail only when block/step selectors cannot locate it
precisely. Provide an explicit, resolvable anchor for each selector and include
its code in the relevant heading, table row, or diagram label. Diagrams may use
separate internal node IDs; record the public selector on the visible element.

Preserve selectors across refresh and reordering. Keep retired or superseded
selectors with their disposition and replacement links; allocate a new code for
a new element. Never reuse or renumber codes to match document position.

Maintain one **Spec Traceability** table in architecture: real `OUT-###` / `AC-###`
code and SPEC section selector; architecture block/flow-step/detail selectors;
exact accepted grill `Q<N>` log-entry and evidence anchors; coverage explanation.
This is a many-to-many mapping: list every applicable target or use separate rows
when the relationships differ. An ID without a resolvable target is not coverage.
A Q ID alone is insufficient when the log has superseding entries: select the
accepted entry using its exact anchor and the recorded source identity.

Architecture precedes SPEC. Its initial table records `pending-spec-ids` with
architecture selectors and Q evidence ready; it invents no OUT/AC codes. A
source-driven architecture refresh marks affected mappings pending until the spec
is reconciled. Pending mappings permit the architecture-to-create-spec handoff,
not backlog projection or delivery.

After drafting stable OUT/AC codes, `create-spec` completes only architecture's
traceability metadata (table, state, and necessary links/updated date). It does
not change accepted design. Require every current outcome and criterion to map
to the relevant architecture selectors and accepted Q evidence; coverage must
reflect the actual constraint, not merely shared vocabulary. When an outcome or
criterion has no structural counterpart, record `not applicable` with the reason
and its accepted Q evidence. Architecture and spec use the same codes. Preserve
existing spec codes; retire superseded mappings explicitly.

Validate the whole proposed pair, set traceability to `complete`, retain the
updated architecture under **Retention and handoff**, then put that final
immutable architecture identity in SPEC and retain SPEC. Architecture uses real
spec codes as lookup keys; validate them against the proposed/current pair. A
sibling SPEC link is optional only when its target exists in the retained tree,
not merely in a later commit. The final pair handoff carries verified immutable
URLs for both artifacts. Architecture stores no immutable SPEC identity, which
would create a hash cycle. Missing or inconsistent mappings
block the final pair and return exact gaps to requirements; a structural mapping
error can be repaired as metadata without reopening an accepted decision.

## Atomic failure

Validate the whole candidate before writing canonical architecture or bookkeeping.
On a source, identity, coverage, or consistency failure, preserve the prior
canonical artifact and return one `architecture-not-ready` result listing **all**
exact gaps, affected question/evidence anchors, guarantees at stake, and upstream
routes. Route decisions and contradictions to `requirements-phase` /
`requirements-grill`; request targeted evidence through that phase when needed.
Do not interview, fill gaps with defaults, or publish a partial replacement.

A retention failure also returns `architecture-not-ready`, naming the failed
retention check and repair needed. Keep any complete local candidate or commit
explicitly unretained; downstream work cannot consume it. Preserve unrelated
changes and any previously verified artifact identity.

## Retention and handoff

1. Persist the complete architecture and required planning-surface bookkeeping in
   a dedicated commit limited to those paths. Inspect the staged diff; preserve
   unrelated edits and staging. Include all final visual content before commit.
2. Push or retain that commit through the repository-approved remote mechanism.
   Verify the retained remote ref contains the commit. Construct an immutable
   blob URL pinned to the full commit SHA and exact artifact path.
3. Read back the remote artifact, compare its bytes with the committed artifact,
   and verify that the recorded source identities still match current inputs.
   Mutable branch URLs, a local-only SHA/path, or a timestamp are insufficient.
4. Only then return `architecture-written`, `readiness: agent-ready`, capability
   identity, source identities, artifact path, full commit SHA, verified remote
   ref, and verified immutable blob URL. Include spec-traceability state,
   validation limits, and non-material unknowns. Carry this proof in the handoff or Context Pointer; do not try to
   embed an artifact's own commit SHA in that artifact.

Git retention is the only publication here. Perform no issue, backlog, or other
provider writes. Failure to retain prevents handoff, not an invitation to add
an approval ceremony.

## Freshness and downstream use

Every delivery requires a current retained `ARCHITECTURE.md` / `SPEC.md` pair
before dispatch, including fresh, resumed, direct, review, repair, debugging, and
closeout entrypoints. Local delivery and architecture applicability do not exempt
the artifact requirement. Architecture compilation is the earlier producer step;
it requires source decisions, not that downstream pair.

At each consumption, verify the immutable URL/commit/path and retained bytes,
capability identity, current source content identities, and accepted decisions.
Compare both artifacts with current grill status/log/glossary and with each other.
Require the spec to reference the verified architecture identity and incorporate
its accepted constraints. Require complete **Spec traceability** coverage for
every current OUT/AC code, resolving its architecture and accepted Q targets. A path that still exists or a newer timestamp does not
establish freshness.

Missing, changed, unretained, or conflicting evidence blocks downstream dispatch.
Return exact gaps to `requirements-phase`; refresh and retain affected artifacts
in architecture-then-spec order before continuing. Neither a previous ready
handoff nor a plan can waive this check. Carry the verified pair and source
identities through the existing Context Pointer to planning, implementation, and
review; planning adds execution detail without assuming architecture authorship.
