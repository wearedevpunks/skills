# Review Phase Graph Authoring Handoff

This is the graph-authoring record. It is separate from review runtime
handoffs, retained reports, and delivery handoffs.

Test references below are source-repository provenance. The installed package
omits the source repository test files; reproduce a claim from the immutable
source commit with its named command and contract seam.

## Router Selection

Phase: router

Status: complete

Scope: Convert the canonical `review-phase` runtime skill to a graph without
changing its explicit-only invocation or readonly review boundary.

Artifacts:

- Existing `SKILL.md`, `REFERENCE.md`, `references/state-graph.md`,
  `references/targets.md`, `references/durable-report.md`, and
  `scripts/review-contract.mjs` inspected.
- Existing delivery and standalone states, authority, retention, and terminal
  behavior supply complete router inputs.

Validation:

- Bounds and obligations are already fixed by the accepted review graph.
- State and authority references cover review entry, running, retention,
  routing, terminal failure, terminal exhaustion, cold resume, and downstream
  delivery ownership.
- The old root contained executable review steps and the target router was
  absent, so `write-router.md` was the single selected authoring phase.

Domain state: `write-router` selected from current artifacts. No earlier
qualification, state-model, or authority repair is required.

Next suggested route: `write-router.md`

Blockers: none

Resume identity: none; current target artifacts reconstruct the selection.

## Write Router Outcome

Phase: write-router

Status: complete

Scope: Replace the executable root with bootstrap-only guidance and add the
deterministic cold-resume router.

Artifacts:

- `SKILL.md`: explicit-only bootstrap with one router pointer.
- `phases/router.md`: evidence authority, conflict tie-breaks, complete legal
  state coverage, and single-valued route precedence.
- `AUTHORING-HANDOFF.md`: durable graph-authoring outcome.

Validation:

- Root contains invocation policy and bootstrap only; executable review work is
  absent.
- Router precedence returns one gate filename or one terminal, checkpoint, or
  blocked outcome.
- Every selected gate filename is flat under `phases/`.
- Cold resume derives from current evidence and committed artifacts rather than
  transcript continuity.

Domain state:

- Pending gate files: `prepare-review.md`, `run-review.md`, `retain-report.md`,
  and `return-route.md`. These filenames are intentional future targets and are
  not links until write-phases creates them.
- Pending runtime handoff obligation: define every gate exit and the discoverable
  review-owned durable handoff contract in `define-handoffs.md`.
- Pending disclosure obligation: prove bootstrap -> router -> one selected gate
  reachability and sibling isolation in `verify-disclosure.md`.
- Pending test obligation: exercise the nine authoring route scenarios and the
  runtime legal-state matrix in `test-routes.md`.
- Pending audit obligation: verify every mandatory obligation, route, pointer,
  handoff, validator, and terminal guard in `audit.md`.

Next suggested route: `write-phases.md`

Blockers: none

Resume identity: none; current target artifacts reconstruct the outcome.

## Router Re-entry After Gate Authoring

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after all router-selected runtime
gate files were written.

Artifacts:

- `phases/prepare-review.md`, `phases/run-review.md`,
  `phases/retain-report.md`, and `phases/return-route.md` exist as flat gate
  files selected by `phases/router.md`.
- The obsolete root review reference still contained executable lens,
  validation, evidence, and route-output steps already owned by the gates.

Validation:

- Every router-selected gate filename exists exactly once under `phases/`.
- Every gate has the normalized guard, inputs, actor boundary, bounded action,
  invariants, completion evidence, exits, durable handoff, and stop or re-entry
  categories.
- Executable work remained duplicated in a target reference, so the
  `write-phases.md` completion guard had not passed.

Domain state: `write-phases` remained the single selected authoring phase until
the obsolete executable reference was deleted.

Next suggested route: `write-phases.md`

Blockers: none

Resume identity: none; current gate and reference artifacts reconstruct the
selection.

## Write Phases Outcome

Phase: write-phases

Status: complete

Scope: Finish the flat runtime gate layer and leave executable review work only
inside router-selected gate files.

Artifacts:

- `phases/prepare-review.md`: entry validation, normalization, identity,
  delivery-budget recovery, and frozen predecessor evidence.
- `phases/run-review.md`: one frozen all-lens review, adversarial skill evidence,
  readonly validation, findings, and local immutable report assembly.
- `phases/retain-report.md`: report validation, freshness, uniqueness, envelope
  retention, retained authority, and pass projection.
- `phases/return-route.md`: retained-pass revalidation and deterministic readonly
  route output.
- The obsolete root review reference was deleted after its executable material
  moved into the four gates. Shared operational references under `references/`
  remain evidence and schema authority only.

Validation:

- The router selects exactly the four flat gate filenames listed above, and
  every selected file exists.
- Each gate contains exactly one normalized category set: Entry Guard, Inputs,
  Actor-Like Gate Boundary, Bounded Action, Invariants, Completion Evidence,
  Declared Exits, Durable Handoff, and Stop Or Router Re-entry.
- Gate ownership is bounded: preparation freezes evidence, review creates the
  local report, retention establishes durable authority, and return emits
  routing evidence.
- Root bootstrap and target references contain no executable gate body.
- No gate directly loads a sibling gate; nonterminal exits stop or re-enter the
  router.

Domain state:

- Gate authoring is complete.
- Pending runtime handoff obligation: define shared storage, latest-applicable
  record discovery, gate exit coverage, and the zero-write exhaustion exception
  in `define-handoffs.md`.
- Pending disclosure obligation: prove bootstrap -> router -> one gate context
  reachability and sibling isolation in `verify-disclosure.md`.
- Pending test obligation: exercise all nine authoring scenarios and the full
  runtime route matrix in `test-routes.md`.
- Pending audit obligation: verify every obligation, route, pointer, handoff,
  validator, and terminal guard in `audit.md`.

Next suggested route: `define-handoffs.md`

Blockers: none

Resume identity: none; current target artifacts reconstruct the outcome.

## Router Re-entry After Gate Completion

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after the root, router, and four
runtime gates became complete.

Artifacts:

- The four gates declared durable outcomes but deferred shared storage and
  latest-applicable discovery.
- Delivery already exposes a caller-owned phase handoff; standalone review had
  no deterministic repository-local runtime handoff path.

Validation:

- Gate files and router coverage are complete.
- Stateful exit coverage, shared categories, storage, discovery, reconciliation,
  and no-write exceptions were incomplete.
- `define-handoffs.md` was therefore the single selected authoring phase.

Domain state: `define-handoffs` selected from current gate and delivery-handoff
evidence.

Next suggested route: `define-handoffs.md`

Blockers: none

Resume identity: none; current artifacts reconstruct the selection.

## Define Handoffs Outcome

Phase: define-handoffs

Status: complete

Scope: Define one exact, cold-resumable runtime handoff contract for delivery
and standalone review modes.

Artifacts:

- `references/runtime-handoff.md`: mode-specific storage, exact
  `review-handoff-v1` categories and fields, append/reconciliation rules,
  cold-resume discovery, evidence authority, and no-write outcomes.
- `phases/router.md`: discovers the applicable runtime record before route
  precedence and persists router-owned stateful outcomes.
- All four gate Durable Handoff sections point to the shared contract rather
  than restating storage or schema.

Validation:

- Delivery mode reuses the validated caller-provided delivery handoff and
  creates no second delivery authority.
- Standalone mode derives one repository-local path from canonical lineage and
  run identities.
- Every stateful gate exit and retained-ref checkpoint writes the exact shared
  category shape when storage is valid.
- Explicit no-write outcomes are limited to already-authoritative exhaustion,
  not-due delivery state, pre-storage terminal or blocker evidence, conflict,
  and identical rediscovery.
- Cold resume selects the highest valid attempt only after mode, lineage, run,
  scope, schema, and current freshness checks; direct evidence and fresh
  artifacts outrank handoff state and suggestions.

Domain state:

- Runtime handoff authoring is complete; no irreducible state remains.
- Pending disclosure obligation: prove bootstrap -> router -> selected gate ->
  runtime handoff reachability and sibling isolation in `verify-disclosure.md`.
- Pending test obligation: exercise all nine authoring scenarios, both storage
  modes, no-write exceptions, conflicts, and the runtime route matrix in
  `test-routes.md`.
- Pending audit obligation: verify every obligation, route, pointer, handoff,
  validator, and terminal guard in `audit.md`.

Next suggested route: `verify-disclosure.md`

Blockers: none

Resume identity: none; current target artifacts reconstruct the outcome.

## Router Re-entry After Handoff Completion

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after the shared runtime handoff
contract became complete.

Artifacts:

- `SKILL.md`, `phases/router.md`, all four flat gates, and
  `references/runtime-handoff.md` exist and agree on stop, re-entry, storage,
  and cold-resume ownership.
- Evidence and schema references remained reachable only through runtime
  branches that need them.

Validation:

- Root bootstrap, router selection, gate files, and runtime handoff exist.
- Handoff storage and discovery are complete, while context traces, pointer
  reachability, and sibling isolation had no durable verification outcome.
- `verify-disclosure.md` was therefore the single selected authoring phase.

Domain state: `verify-disclosure` selected from current bootstrap, router,
gate, reference, and runtime-handoff evidence.

Next suggested route: `verify-disclosure.md`

Blockers: none

Resume identity: none; current artifacts reconstruct the selection.

## Verify Disclosure Outcome

Phase: verify-disclosure

Status: complete

Scope: Prove explicit invocation reaches the bootstrap, router, exactly one
selected gate, and only the conditional evidence needed by that gate.

Artifacts:

- `phases/router.md`: every gate output is a resolvable link, sibling isolation
  is explicit, and the state model has a conditional evidence trigger.
- `phases/retain-report.md` and `phases/return-route.md`: nonterminal re-entry
  resolves back to the router.
- `references/durable-report.md`: schema and retained-pass evidence no longer
  point forward into a sibling gate.

Validation:

- Explicit `$review-phase` invocation loads `SKILL.md`, then
  `phases/router.md`. Terminal, checkpoint, and blocked rows return directly;
  each executable row loads exactly one of `prepare-review.md`,
  `run-review.md`, `retain-report.md`, or `return-route.md`.
- Prepare conditionally reaches target/identity evidence and the runtime
  handoff; run reaches report schema and the runtime handoff; retain and return
  reach report validity, the executable validator, and the runtime handoff.
- All four gates re-enter only the router. No gate or selected-gate reference
  links to a sibling gate.
- Every Markdown pointer in bootstrap, router, gates, and references resolves.
  `references/state-graph.md`, `targets.md`, `durable-report.md`, and
  `runtime-handoff.md` are reachable from the router or their consuming gate.
- References contain state evidence, identity/report schemas, validation
  predicates, and shared handoff storage/discovery only. Gate-local guards,
  bounded actions, exits, and stop behavior remain in flat phase files.

Domain state:

- Progressive disclosure and sibling isolation are complete.
- Pending test obligation: exercise all nine authoring scenarios, both runtime
  storage modes, no-write outcomes, conflicts, and every router class in
  `test-routes.md`.
- Pending audit obligation: verify every obligation, route, pointer, handoff,
  validator, and terminal guard in `audit.md`.

Next suggested route: `test-routes.md`

Blockers: none

Resume identity: none; current artifacts reconstruct the outcome.

## Router Re-entry After Disclosure Completion

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after progressive-disclosure and
sibling-isolation evidence became complete.

Artifacts:

- Bootstrap, router, four flat gates, conditional references, and the runtime
  handoff were complete and reachable.
- `tests/review-phase-graph.contract.test.mjs` still targeted the deleted root
  `REFERENCE.md` and stale pre-graph wording.

Validation:

- Disclosure completion was durable.
- The focused route contract was observed RED against deleted or relocated
  authority.
- The nine authoring route predictions and runtime storage/no-write cases were
  not yet executable or recorded, so `test-routes.md` was the single route.

Domain state: `test-routes` selected from current graph artifacts and observed
RED contract evidence.

Next suggested route: `test-routes.md`

Blockers: none

Resume identity: none; current artifacts and test output reconstruct the
selection.

## Test Routes Outcome

Phase: test-routes

Status: complete

Scope: Exercise every runtime router class, both handoff storage modes,
authoritative no-write outcomes, conflicts, and the nine authoring scenarios.

Artifacts:

- `tests/review-phase-graph.contract.test.mjs`: graph-owned gate assertions,
  ordered router-output coverage, and runtime handoff storage/reconciliation
  coverage.
- Route predictions were frozen before contract derivation:

| Scenario | Predicted route | Derived route | Match | Repair if mismatch |
| --- | --- | --- | --- | --- |
| Baseline path | Fresh valid `review_due` -> `prepare-review.md` | Priorities 1-11 do not match; priority 12 selects `prepare-review.md` | Yes | none |
| Branch path | Complete fresh local report without retained authority -> `retain-report.md` | Priority 10 selects `retain-report.md` | Yes | none |
| Repair cycle | Delivery repair changes the target and persists new `review_due` -> `prepare-review.md` | Fresh mutation invalidates later review evidence; priority 12 selects `prepare-review.md` and review opens no repair | Yes | none |
| Human checkpoint | Fresh report requires an unapproved retained ref -> checkpoint `retained_ref_approval_required` | Priority 3 wins before retention mutation | Yes | none |
| Cold resume | Highest valid same-run attempt is fresh `review_running`, with no complete report -> `run-review.md` | Discovery selects that attempt; priority 11 selects `run-review.md` | Yes | none |
| Stale, out-of-scope, or invalid artifact | Stale local report -> `prepare-review.md`; out-of-scope handoff with no valid current context -> blocked `review_context_blocked`; invalid active retained candidate -> terminal `review_failed` | Freshness rejects stale evidence at priority 12; scope rejection leaves priority 5; invalid candidate matches priority 1 | Yes | none |
| Contradictory suggested route loses to evidence | Suggestion says `retain-report.md`, but one fresh retained pass lacks returned routing -> `return-route.md` | Fresh artifact authority outranks suggestion; priority 9 selects `return-route.md` | Yes | none |
| Nested executor substitution with an actor-like gate boundary | Fresh `review_running` remains `run-review.md` while a narrower readonly executor returns advisory evidence | Parent gate validates executor output and retains exit ownership; priority 11 remains `run-review.md` until a complete report exists | Yes | none |
| Premature completion rejected by terminal guard | Fresh retained standalone report without durable returned routing -> `return-route.md`, not `review_complete` | Terminal priority 7 requires both retained report and returned output; priority 9 selects `return-route.md` | Yes | none |

Validation:

- All nine predictions matched derivation; no runtime contract mismatch required
  repair.
- Stale, out-of-scope, and invalid artifact subcases resolve separately.
- The focused source contract moved from observed RED to GREEN after replacing
  deleted-root assertions and adding runtime graph contracts.
- Router priorities 1-12 cover terminal, checkpoint, blocked, and all four gate
  outputs. Delivery and standalone storage, conflict, and every declared
  authoritative no-write class are executable assertions.

Domain state:

- Route testing is complete with zero prediction mismatch and zero target graph
  repair.
- Pending audit obligation: verify every mandatory obligation, route, pointer,
  handoff, validator, and terminal guard in `audit.md`.

Next suggested route: `audit.md`

Blockers: none

Resume identity: none; current tests, matrix, and graph artifacts reconstruct
the outcome.

## Router Re-entry After Route Testing

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after route predictions, runtime
storage modes, no-write outcomes, conflicts, and router classes were tested.

Artifacts:

- The canonical source review-graph contract and its named Node command.
- `Test Routes Outcome`: nine frozen predictions with nine matching derived
  routes and zero graph repairs.

Validation:

- Every earlier authoring phase had fresh completion evidence.
- Focused route contracts and the nine-scenario matrix were green.
- Terminal readiness, the no-op test, and the external skill validator still
  lacked an audit outcome, so `audit.md` was the single selected phase.

Domain state: `audit` selected from current graph artifacts and route-test
evidence.

Next suggested route: `audit.md`

Blockers: none

Resume identity: none; current artifacts and tests reconstruct the selection.

## Audit Outcome

Phase: audit

Status: blocked

Scope: Apply the terminal graph audit across obligations, authority, resume,
exits, handoffs, disclosure, tests, syntax, and the available skill validator.

Artifacts:

- `SKILL.md`, `agents/openai.yaml`, `phases/router.md`, four flat gate files,
  four references, and `scripts/review-contract.mjs`.
- The canonical source review-graph contract and shared source contract command.

Validation:

- Four gates each contain all nine required gate sections. The router has 12
  ordered rows: four gate routes and eight terminal, checkpoint, or blocked
  routes.
- The runtime handoff accounts for eight stateful classes and five
  authoritative no-write classes. Every write-capable exit commits a durable
  handoff; all no-write exceptions are named.
- Target and bounds precede delivery budget. Invalid evidence precedes budget,
  checkpoint, conflict, context, not-due, terminal, and executable routes.
  Direct invocation outranks fresh artifacts, which outrank handoff state,
  which outranks suggestions.
- Cold resume discovers current evidence, reconciles same-authority conflicts,
  and derives one route. Transition meanings remain single-owned by the router,
  one selected gate, or a schema/evidence reference.
- All 23 operational Markdown pointers resolve; there are zero dead pointers
  and zero sibling-gate links. The disclosure trace loads bootstrap, router,
  and exactly one selected gate, with references loaded conditionally.
- The no-op test required zero deletions: each remaining instruction changes
  invocation, routing, evidence, validation, persistence, or stop behavior.
- `SKILL.md` and `agents/openai.yaml` consistently disable implicit invocation.
- The focused and shared source contract commands pass. Both Node
  files pass syntax checks, and the scoped diff passes `git diff --check`.
- The requested literal `python` command is unavailable. The same validator
  executed through `uv run --with pyyaml python` and failed because
  `quick_validate.py` rejects the intentional `disable-model-invocation`
  frontmatter key.

Domain state:

- Graph obligations, routes, handoffs, disclosure, tests, and syntax pass.
- Terminal completion is withheld because the available validator does not
  pass the required explicit-only frontmatter contract.
- Earliest responsible authoring phase: `write-router.md`, which owns the root
  bootstrap and invocation policy. Re-entry must preserve explicit-only
  behavior; removing `disable-model-invocation: true` is not a valid repair.

Terminal decision: not audit-complete; re-enter root for `write-router.md`.

Next suggested route: `write-router.md`

Blockers: validator schema does not admit the required explicit-only
`disable-model-invocation` key.

Resume identity: none; the graph, tests, and validator output reconstruct the
outcome.

## Router Re-entry After Validator Classification

Phase: router

Status: complete

Scope: Recompute the graph-authoring route after classifying the validator
failure recorded by the preceding audit.

Artifacts:

- `/Users/stefan/.codex/skills/.system/skill-creator/scripts/quick_validate.py`:
  OpenAI-only validator with a hardcoded frontmatter allowlist.
- `SKILL.md`, `agents/openai.yaml`, and focused source contracts: intentional
  cross-agent explicit-only invocation evidence.
- `npx --yes skills add /Users/stefan/.codex/worktrees/review-phase-graph-skills
  --list`: applicable packaging validation evidence.

Validation:

- `quick_validate.py` permits only `name`, `description`, `license`,
  `allowed-tools`, and `metadata`; it cannot classify this cross-agent skill
  dialect.
- The applicable packaging validator exits zero, reports `Local path
  validated`, discovers 106 skills, and lists `review-phase` with its exact
  description while preserving `disable-model-invocation: true`.
- Source contracts require the frontmatter key and
  `agents/openai.yaml` independently disables implicit invocation. Removing the
  key would create a target defect; retaining it is not a `write-router.md`
  defect.
- The preceding blocked audit remains historical evidence. Its blocker is
  reclassified as an inapplicable-validator result, so `audit.md` is the single
  selected phase.

Domain state: no target graph repair is required; `audit` reselected with an
applicable validator result.

Next suggested route: `audit.md`

Blockers: none

Resume identity: none; the graph, validator source, and packaging output
reconstruct the selection.

## Audit Outcome

Phase: audit

Status: complete

Scope: Close the terminal audit using the applicable cross-agent packaging
validator and the preceding complete graph, route, disclosure, and test
evidence.

Artifacts:

- `SKILL.md`, `agents/openai.yaml`, `phases/router.md`, four flat gate files,
  four references, and `scripts/review-contract.mjs`.
- The canonical source review-graph and shared contract commands, plus the
  applicable `skills` packaging validator output.

Validation:

- Four gates each contain all nine required gate sections. The router has 12
  ordered rows: four gate routes and eight terminal, checkpoint, or blocked
  routes.
- The runtime handoff accounts for eight stateful classes and five
  authoritative no-write classes. Every write-capable exit commits a durable
  handoff; all no-write exceptions are named.
- Authority and precedence are deterministic. Cold resume reconstructs one
  route from current evidence and discoverable handoffs. Transition meanings
  have one owner.
- All 23 operational Markdown pointers resolve; there are zero dead pointers
  and zero sibling-gate links. Bootstrap, router, and exactly one selected gate
  form the progressive-disclosure trace.
- The no-op test required zero deletions. Root frontmatter and
  `agents/openai.yaml` consistently enforce explicit-only invocation.
- The focused and shared source contract commands pass. Both Node
  files pass syntax checks, and the scoped diff passes `git diff --check`.
- The applicable packaging validator exits zero, validates the local path,
  discovers 106 skills, and lists `review-phase` with the exact source
  description while preserving its required frontmatter dialect.
- The rejected `quick_validate.py` result is retained as evidence of an
  inapplicable OpenAI-only schema, not a target validation failure.

Domain state: every terminal audit obligation passes; no target repair or
additional authoring phase remains.

Terminal decision: `audit-complete`.

Next suggested route: terminal `audit-complete`

Blockers: none

Resume identity: none; the graph, tests, handoff history, validator
classification, and packaging evidence reconstruct terminal completion.
