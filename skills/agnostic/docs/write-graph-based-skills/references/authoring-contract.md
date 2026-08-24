# Authoring Contract for Durable Workflow Graph Skills

Use this contract when you are creating a graph-based skill, converting a linear multi-step skill, or auditing and repairing routing failures.

## Authoring Phase Outcome

Every creator phase writes or updates its entry in `<target-skill>/AUTHORING-HANDOFF.md`. The authoring router discovers the record at that exact path. This authoring record is separate from the target skill's runtime handoff contract.

```text
Phase:
Status:
Scope:
Artifacts:
Validation:
Domain state:
UI Evidence:
Next suggested route:
Blockers:
Resume identity:
```

Status is phase-scoped. Keep artifacts and validation separate, use domain state for authoring decisions or unresolved obligations, and omit UI evidence when it is not applicable. The next suggested route is advisory; router re-entry derives the route from current evidence. Resume identity contains only run, revision, attempt, or dependency fields that current artifacts cannot reconstruct reliably.

## Obligation Map

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |

Freshness note:
- Assign freshness checks wherever evidence can change while waiting.

Default decision:
- Use a graph for every multi-step skill.
- Use direct composition only for one atomic, discardable, cheap-to-restart action with no routing, repair, or resume obligation.

Completion criterion:
- Mandatory obligations each include evidence artifact and audit criterion.
- Graph authoring is selected unless the direct-composition exception is proved.

## State and Topology

### State Table

| State ID | Meaning | Scope | Entry guard | Exit guard | Next states |
|---|---|---|---|---|---|
|  |  |  |  |  |  |
|  |  |  |  |  |  |

### Gate Table

| Gate ID | Entry guard | Actor-like gate boundary owner | Internal delegation policy | Reconciliation rule | Outputs | Exit semantics | Durable handoff |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

### Graph Layer

| Path | Branch condition | Cycle target | Skip condition | Checkpoint condition |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |

Completion criterion:
- Every state defines scope, entry guard, exit guard, and next states.
- Every branch/cycle/skip/checkpoint form is represented in Graph Layer or marked N/A.

## Transition Guards and Precedence

| Transition | Evidence condition | Freshness | Scope | Validity | Conflicts | Tie-break rule | Derived route |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

Authority table:

| Signal | Priority | Allowed when conditions pass |
|---|---|---|
| Current direct evidence | 1 | evidence is direct and admissible |
| Fresh workflow-native artifacts | 2 | artifact is fresh, valid, and in scope |
| Committed handoff | 3 | handoff is committed and intact |
| Suggested route | 4 | suggestion only |

Completion criterion:
- Every ambiguous set has an explicit precedence path and deterministic tie-break to one route.

## Router Contract

Inputs:
- current evidence,
- active obligations,
- current artifacts,
- committed handoffs,
- terminal flags.

Outputs:
- Exactly one of:
  1) one selected gate,
  2) one terminal route,
  3) one checkpoint route,
  4) one blocked route.

Rules:
- Router names the internal transition contract.
- Decision recomputes on re-entry and cold resume using the authority table.

Completion criterion:
- one output route for each legal state.

## Human Steering Terminal

Every graph includes `human_steering_required` as a terminal, non-success
state. The gate that selects it invokes `$handback`, writes that skill's durable
outcome, and stops. The router keeps returning the terminal until the
`$handback` authority guard passes.

## Gate Contract

For each gate define:

- Entry guard.
- Actor-like gate boundary and bounded ownership.
- Optional internal delegation.
- Reconciliation plan for delegated work.
- Output artifacts and validation.
- Exit semantics in workflow-owned vocabulary.
- Durable handoff.

Use this category shape for each produced target handoff:

```text
Phase:
Status:
Scope:
Artifacts:
Validation:
Domain state:
UI Evidence:
Next suggested route:
Blockers:
Resume identity:
```

Status remains phase-scoped, while the domain-state label uses workflow-specific vocabulary; for example, a delivery workflow may use `Review/debug/docs state`. UI evidence is optional. Resume identity includes only run, revision, attempt, or dependency fields required for reliable resume.

Across the graph, exit semantics coverage must include applicable operational outcomes:
- successful completion,
- blockers,
- intentional skip or no-op,
- human checkpoint.

The [human steering terminal](#human-steering-terminal) is distinct from a
planned human checkpoint.

Completion criterion:
- across the graph, coverage includes applicable completion, blocker, skip-or-no-op, and human-checkpoint meanings.
- each gate lists only outcomes it can emit.
- each actor-like gate boundary owns only its bounded work, and every exit writes a durable handoff.

## Durable Handoff Questions

Ask only for state that the router cannot infer from current evidence:

- Which gate-local facts cannot be reconstructed from current artifacts?
- Which uncertainty blocks deterministic continuation?
- What exact evidence is missing to choose a safe next route?
- What minimum preserved state is needed for a reliable resume?

Optional note:
- A route suggestion may be attached but remains optional and lowest authority.

Completion criterion:
- each selected question is workflow-specific and captures state current evidence cannot infer.

## Route Matrix (ten scenarios)

| Scenario | Predicted route (record first) | Derived route (apply contracts) | Match | Repair if mismatch |
|---|---|---|---|---|
| Baseline path |  |  |  |  |
| Branch path |  |  |  |  |
| Repair cycle |  |  |  |  |
| Human checkpoint |  |  |  |  |
| Failure handback terminal |  |  |  |  |
| Cold resume |  |  |  |  |
| Stale, out-of-scope, or invalid artifact |  |  |  |  |
| Contradictory suggested route loses to evidence |  |  |  |  |
| Nested executor substitution with an actor-like gate boundary |  |  |  |  |
| Premature completion rejected by terminal guard |  |  |  |  |

Completion criterion:
- all ten rows are filled with stale, out-of-scope, and invalid as subcases.
- the failure-handback row proves the `human_steering_required` terminal and
  `$handback` authority guard; the planned human-checkpoint row remains distinct.
- repairs are present only when match is No.

## Final Audit

- All mandatory obligations map to states and gates.
- Router and gates are deterministic under the authority table.
- Cold resume derives from current evidence, workflow-native artifacts, and committed handoffs.
- Every exit commits a durable handoff.
- `human_steering_required` invokes `$handback`, commits its outcome, and keeps
  the terminal until that skill's authority guard passes.
- Terminal guard accounts for every mandatory obligation.
- The skill-protocol boundary is the set of written contracts and durable evidence.
- Markdown cannot enforce exclusive writers, execution ordering, or atomic persistence; require an external runtime only when one of those guarantees is a correctness requirement.
- Progressive-disclosure context-load trace shows bootstrap/router and the single selected gate only.

Completion criterion:
- all decisions required for safe route reconstruction and resume are resolved.
