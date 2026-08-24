---
name: write-graph-based-skills
description: Write graph-based skills as Durable Workflow Graphs. Use when creating a graph-based skill, converting a linear multi-step skill, or repairing evidence routing, cold resume, or premature completion.
---

# Write Graph-Based Skills

## Model Primer

- State-machine: explicit states, transition guards, and deterministic resume behavior.
- Actor-like gate boundary: bounded ownership of work, internal delegation, validation, and the durable handoff returned to the router.
- Graph: explicit paths, branches, cycles, skips, and checkpoints.
- Router here names the workflow's internal transition contract.
- Durable handoff makes execution stateful by committing validated gate state before a stop or router return.
- Human steering is the terminal boundary defined in the [authoring contract](references/authoring-contract.md#human-steering-terminal).
- Written contracts and durable evidence define the skill-protocol boundary. Markdown cannot enforce exclusive writers, execution ordering, or atomic persistence; require an external runtime only when one of those guarantees is a correctness requirement.

## Quick Start

1. Load [`phases/router.md`](phases/router.md) first.
2. Inspect the target skill's current artifacts, evidence, and latest authoring outcomes. Re-derive the route on every entry, including cold resume.
3. Load exactly one phase selected by the authoring router. Keep sibling phase files out of context.
4. Complete that phase's bounded work and checks.
5. Write its durable phase outcome to the active authoring record.
6. Stop on a blocker or checkpoint. Otherwise stop or re-enter this root router.

Use [`references/authoring-contract.md`](references/authoring-contract.md) as the single shared worksheet. Create the creator workflow's durable authoring record at `<target-skill>/AUTHORING-HANDOFF.md`; the authoring router discovers it at that exact path. This record tracks creation, conversion, or repair work. It is separate from the target skill's runtime handoff contract. Current target artifacts remain more authoritative than its route suggestion.

## Entry Modes

Use a graph for every multi-step skill. Direct composition is the narrow qualification exception defined below.

- **Create:** start from a new target skill and unresolved workflow obligations.
- **Convert:** inspect an existing linear multi-step skill and preserve valid work while making states, routes, gates, and durable handoffs explicit.
- **Repair:** begin from stale, contradictory, unreachable, or incomplete routing evidence and change only the broken contracts.
- **Direct composition:** exit during qualification only for one atomic, discardable, cheap-to-restart action with no routing, repair, or resume obligation.

Keep the package's current invocation policy unless target requirements deliberately choose another one.

## Phase Files

- [`phases/router.md`](phases/router.md): select exactly one next authoring phase from current evidence.
- [`phases/audit.md`](phases/audit.md): run the terminal completeness and validator audit.
- [`phases/define-authority.md`](phases/define-authority.md): define evidence authority and deterministic tie-breaks.
- [`phases/define-handoffs.md`](phases/define-handoffs.md): define workflow-owned durable handoffs.
- [`phases/model-state.md`](phases/model-state.md): define evidence states, topology, guards, and obligation reachability.
- [`phases/qualify.md`](phases/qualify.md): define obligations, survivor artifacts, and the direct-composition boundary.
- [`phases/test-routes.md`](phases/test-routes.md): predict, derive, and repair route scenarios.
- [`phases/verify-disclosure.md`](phases/verify-disclosure.md): verify context reachability and sibling isolation.
- [`phases/write-phases.md`](phases/write-phases.md): write every executable target gate file.
- [`phases/write-router.md`](phases/write-router.md): write the target bootstrap and target router.

## Required Target Structure

Every produced graph-based skill must use this shape:

```text
<target-skill>/
├── SKILL.md
├── AUTHORING-HANDOFF.md
└── phases/
    ├── router.md
    └── <gate>.md
```

- `SKILL.md` contains bootstrap and invocation guidance. It does not contain executable gate bodies.
- `phases/` is flat. It contains `router.md` and one `<gate>.md` for every executable gate or step selected by the target router.
- Every target gate file defines: guard, inputs, bounded action or delegation, invariants, completion evidence, declared exits, and durable handoff.
- `AUTHORING-HANDOFF.md` is this creator workflow's durable authoring record. It is separate from the target skill's runtime handoffs.
- `references/` is optional. Add it only for shared or genuinely conditional material, and keep executable gate bodies out of it.
- Every operational reference is reachable from the root, router, or selected phase.
- The target handoff contract names its durable storage location and the rule used to discover the latest applicable handoff.

## Router Rules

Use [`phases/router.md`](phases/router.md) as the single source of truth for authoring route order. Reuse fresh complete artifacts. Resolve overlapping guards through the declared authority and precedence rules. Select exactly one phase or declared stop outcome. A suggested phase is advisory and lowest authority. Audit completion is the only graph-authoring terminal.

## Stop Conditions

- After a selected phase writes its outcome, stop or re-enter the root router. Never jump directly to a sibling phase.
- On blocked work, write the blocker and missing evidence, then stop.
- At a human checkpoint, write the decision required, then stop.
- Claim authoring completion only after `audit` verifies every obligation, route, pointer, durable handoff, and applicable validator.
- Keep claims at the skill-protocol boundary. Markdown cannot enforce exclusive writers, execution ordering, or atomic persistence; require an external runtime only when one of those guarantees is a correctness requirement.
