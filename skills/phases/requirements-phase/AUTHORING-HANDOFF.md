# Requirements Phase Authoring Handoff

## Router

Phase: router
Status: complete
Scope: Re-derive authoring state from the complete target package and current validation.
Artifacts: `SKILL.md`; `AUTHORING-HANDOFF.md`; flat `phases/`; runtime handoff reference; focused route contract.
Validation: Every authoring phase has fresh completion evidence and the terminal audit passes.
Domain state: Convert mode preserved valid behavior and invocation policy while adding deterministic routing, repair, and cold resume.
Next suggested route: audit-complete
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan spec `fd02af0f`.

## Qualify

Phase: qualify
Status: complete
Scope: Define graph bounds, owners, survivor artifacts, and audit criteria.
Artifacts: Obligation map below.
Validation: Every mandatory obligation has one owner, durable evidence, and an audit criterion.
Domain state: Convert mode selected; the existing invocation policy and valid grill-to-spec behavior survive conversion.
Next suggested route: model-state
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

### Obligation Map

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
| --- | --- | --- | --- | --- | --- |
| Close or park product decisions | Yes | Yes | Grill status/log and shared-understanding confirmation | `requirements-grill` gate | No material decision remains open |
| Compile an agent-ready spec | Yes | Yes | Retained `SPEC.md`, commit SHA, verified stable URL | `create-spec` gate | Spec is valid, retained, and traceable |
| Project the retained spec | Yes | Yes | Provider identifiers/URLs and spec linkage | `write-backlog` gate | Current projection matches the retained spec |
| Recompute one route | Yes | Yes | Direct artifacts plus `REQUIREMENTS-HANDOFF.md` | requirements router | Exactly one gate or terminal is selected |
| Return discovery needs upward | Yes | Yes | Blocker and missing research/prototype evidence | requirements router | Route is `finder-required` |
| Preserve runtime resume state | Yes | Yes | `<planning-surface>/REQUIREMENTS-HANDOFF.md` | each completed or stopped gate | Required schema is complete |

Survivor artifacts: grill status/log, shared-understanding confirmation, retained agent-ready `SPEC.md`, immutable spec identity, provider projection evidence, and `REQUIREMENTS-HANDOFF.md`.

## Model State

Phase: model-state
Status: complete
Scope: Define evidence states, reachable gates, repairs, skips, and checkpoints.
Artifacts: State, gate, and graph tables below.
Validation: Every mandatory obligation is reachable; stale evidence cycles to the earliest unmet obligation; already-valid evidence skips satisfied gates.
Domain state: State derives from durable evidence, never conversational step count.
Next suggested route: define-authority
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

### State Table

| State | Scope | Entry guard | Exit guard | Next states |
| --- | --- | --- | --- | --- |
| Discovery needed | Requirements boundary | Research or prototype evidence is required to close a material decision | Finder receives missing-evidence detail | `finder-required` |
| Decisions open | Planning surface | A material decision is open or shared understanding is unconfirmed | Decisions closed/parked and confirmation recorded | Spec missing, discovery needed, blocked |
| Spec missing | Planning surface | Decisions are closed/parked; retained agent-ready spec evidence is absent or invalid | Valid retained spec SHA and verified URL exist | Projection missing, decisions open, blocked |
| Projection missing | Planning surface/provider scope | Retained spec is valid; matching current projection is absent or invalid | Provider evidence verifies projection of that spec | Complete, spec missing, blocked |
| Complete | Planning surface/provider scope | Valid retained spec and matching verified projection exist | All evidence remains current | `requirements-complete` or earliest stale state |
| Blocked | Active gate | Selected gate cannot safely advance | Missing evidence or authority becomes available | Router recomputation |

### Gate Table

| Gate | Entry guard | Owner | Delegation | Reconciliation | Output | Exits | Durable handoff |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Requirements grill | Decisions open and discovery is not required | `requirements-grill.md` | `requirements-grill` | Re-read grill evidence and confirmation | Closed/parked decisions | completed, blocked, checkpoint, finder-required | `REQUIREMENTS-HANDOFF.md` |
| Create spec | Decisions closed/parked; retained spec invalid/missing | `create-spec.md` | `create-spec` | Validate readiness, retention, SHA, URL | Retained agent-ready spec | completed, blocked, finder-required | `REQUIREMENTS-HANDOFF.md` |
| Write backlog | Valid retained spec; matching projection invalid/missing | `write-backlog.md` | `write-backlog` | Validate provider evidence and exact spec linkage | Verified projection | completed, blocked, skip/no-op | `REQUIREMENTS-HANDOFF.md` |

### Graph Layer

| Path | Branch condition | Cycle target | Skip condition | Checkpoint condition |
| --- | --- | --- | --- | --- |
| grill -> spec -> backlog -> complete | Each prior obligation becomes valid | Earliest obligation invalidated by fresh evidence | A gate's evidence is already valid | Human decision remains open |
| router -> finder-required | Research or prototype evidence is required | Router after Finder returns evidence | N/A | Finder handoff required |
| selected gate -> blocked | Gate cannot safely advance | Same gate after blocker clears | N/A | External authority or access required |

## Define Authority

Phase: define-authority
Status: complete
Scope: Define admissibility, freshness, and deterministic route precedence.
Artifacts: Authority and transition tables below.
Validation: Stale, invalid, or out-of-scope evidence is ineligible; every overlap resolves to one earliest unmet obligation.
Domain state: Current direct evidence outranks artifacts; fresh workflow-native artifacts outrank the committed handoff; its route suggestion is advisory.
Next suggested route: write-router
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

### Authority Table

| Signal | Priority | Allowed when conditions pass |
| --- | --- | --- |
| Current direct evidence | 1 | Admissible, in scope, and attributable to the active planning surface |
| Workflow-native artifacts | 2 | Fresh, valid, internally consistent, and in scope |
| Committed handoff fields | 3 | Handoff is intact and corroborated by current artifacts |
| Next suggested route | 4 | Advisory only; never overrides derived eligibility |

### Transition Guards

| Transition | Evidence condition | Freshness, scope, validity | Conflict tie-break | Route |
| --- | --- | --- | --- | --- |
| discovery need | A material decision requires research or prototype evidence | Need is current, concrete, and in scope | Discovery need outranks child-gate eligibility | `finder-required` |
| close decisions | Any material decision is open or confirmation is missing | Latest grill evidence belongs to this planning surface | Earliest unmet obligation wins | `requirements-grill.md` |
| compile spec | Decisions are closed/parked; retained spec proof fails | Spec readiness, SHA retention, and URL are verified together | Grill eligibility wins when both appear true | `create-spec.md` |
| project spec | Retained spec is valid; matching provider projection proof fails | Projection is current and links the exact retained spec | Spec eligibility wins when both appear true | `write-backlog.md` |
| complete | Valid retained spec and matching projection proof pass | All mandatory evidence remains current | Any unmet obligation defeats terminal | `requirements-complete` |

Contradictions resolve by discarding stale/invalid evidence, then selecting discovery need or the earliest unmet obligation in `requirements-grill -> create-spec -> write-backlog` order.

## Write Router

Phase: write-router
Status: complete
Scope: Replace the linear root with a bootstrap and write the deterministic runtime router.
Artifacts: `SKILL.md`; `phases/router.md`.
Validation: Root contains bootstrap and pointers only; router preserves explicit-only invocation and returns one gate or terminal for every modeled state.
Domain state: Cold resume derives from direct artifacts; advisory handoff routing cannot override evidence.
Next suggested route: write-phases
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

## Write Phases

Phase: write-phases
Status: complete
Scope: Write one flat actor-like gate file for every router-selected delegation.
Artifacts: `phases/requirements-grill.md`; `phases/create-spec.md`; `phases/write-backlog.md`.
Validation: Every gate defines guard, inputs, bounded delegation, reconciliation, invariants, completion evidence, declared exits, durable handoff, and stop/re-entry behavior.
Domain state: Grill owns human closure, spec owns compilation/retention, backlog owns provider mutation; each gate retains validation and handoff ownership.
Next suggested route: define-handoffs
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

## Define Handoffs

Phase: define-handoffs
Status: complete
Scope: Define one discoverable runtime handoff contract and gate exit coverage.
Artifacts: `references/runtime-handoff.md`; gate durable-handoff sections.
Validation: The schema carries current/last gate, phase status, scope, grill pointers, retained spec SHA and verified URL, projection evidence, validation, requirements state, blockers, advisory route, and irreducible resume identity. Every declared exit writes it.
Domain state: The exact handoff is discovered at `<planning-surface>/REQUIREMENTS-HANDOFF.md`; current evidence overrides stale fields or suggestions.
Next suggested route: verify-disclosure
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

## Verify Disclosure

Phase: verify-disclosure
Status: complete
Scope: Trace bootstrap, router, selected gate, and conditional runtime reference loading.
Artifacts: `SKILL.md`; flat `phases/`; `references/runtime-handoff.md`.
Validation: Every Markdown pointer resolves. Invocation loads bootstrap, router, and one selected gate; the selected gate reaches the shared handoff schema while sibling gates remain out of context.
Domain state: Executable gate bodies live only in flat phase files; the reference defines shared runtime state only.
Next suggested route: test-routes
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

Context trace: `SKILL.md` -> `phases/router.md` -> one of `requirements-grill.md`, `create-spec.md`, or `write-backlog.md` -> `references/runtime-handoff.md` when writing an exit.

## Test Routes

Phase: test-routes
Status: complete
Scope: Predict and derive the nine required authoring scenarios from the target contracts.
Artifacts: Route matrix below; `tests/requirements-phase-route.contract.test.mjs`.
Validation: All predictions match derived routes. Stale, out-of-scope, and invalid evidence are separate subcases. Focused contract suite passes 8/8.
Domain state: No mismatch required a repair.
Next suggested route: audit
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

### Route Matrix

| Scenario | Predicted route | Derived route | Match | Repair if mismatch |
| --- | --- | --- | --- | --- |
| Baseline path: open decisions | `requirements-grill.md` | Earliest unmet obligation is decision closure -> `requirements-grill.md` | Yes | N/A |
| Branch path: current research need | `finder-required` | Discovery guard outranks child eligibility -> `finder-required` | Yes | N/A |
| Repair cycle: projection points to an older spec | `write-backlog.md` | Valid current spec plus mismatched projection makes projection unmet -> `write-backlog.md` | Yes | N/A |
| Human checkpoint: operator decision pending | `requirements-grill` checkpoint | Grill gate records the exact open decision and stops -> checkpoint | Yes | N/A |
| Cold resume: valid spec, no projection | `write-backlog.md` | Direct artifacts reconstruct spec-valid/projection-missing state -> `write-backlog.md` | Yes | N/A |
| Stale, out-of-scope, or invalid artifact | Earliest unmet gate | Stale grill confirmation -> `requirements-grill.md`; out-of-scope spec -> `create-spec.md`; invalid projection -> `write-backlog.md` | Yes | N/A |
| Contradictory suggested route loses to evidence | `requirements-grill.md` | Open direct decision evidence outranks handoff suggestion `requirements-complete` -> `requirements-grill.md` | Yes | N/A |
| Narrower executor substitution | Same selected gate | Gate retains validation and handoff ownership while its named delegate executes bounded work -> same gate exit | Yes | N/A |
| Premature completion rejected | Earliest unmet gate | Missing retained spec or matching projection defeats `requirements-complete` -> `create-spec.md` or `write-backlog.md` | Yes | N/A |

## Audit

Phase: audit
Status: complete
Scope: Audit obligation reachability, terminal accounting, cold resume, precedence, pointers, handoffs, invocation policy, and validation.
Artifacts: Complete graph package; focused contract test.
Validation: Frontmatter parses and preserves explicit-only invocation. All pointers resolve. Focused requirements plus write-backlog suites pass 30/30. Scoped `git diff --check` passes. The generic `quick_validate.py` rejects this repository's established `disable-model-invocation` extension, so repository contract validation is the applicable validator.
Domain state: Every mandatory obligation is reachable and required by the terminal guard. Transition meaning is centralized in `phases/router.md`; gates own execution and exit evidence. No no-op or duplicate executable instruction remains.
Next suggested route: audit-complete
Blockers: None.
Resume identity: Canonical base `b7f939c`; plan task T1.

Terminal decision: audit-complete.
