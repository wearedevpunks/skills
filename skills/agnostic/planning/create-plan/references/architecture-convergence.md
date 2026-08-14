# Architecture Convergence

Use this branch when a plan can change cumulative code ownership. `SPEC.md` owns the accepted target architecture; the saved plan derives its execution contract and later execution checks conformance against it.

## Classify Applicability

Persist `architecture_applicability: local | architecture-bearing` with evidence.

- `local`: one bounded responsibility, with no domain-owner, public-seam, composition, or cross-domain
  dependency change. Keep the ordinary task graph and `codebase_design_notes`; record why this branch does
  not apply.
- `architecture-bearing`: multiple stories or tasks change one capability cumulatively; or any task crosses
  an ownership boundary, changes composition, changes a public seam, introduces a domain, migrates callers,
  or changes cross-domain dependencies.

Classification is complete when every planned location and consumer is covered by one outcome. A plan
cannot use `local` merely because each task looks small in isolation.

## Derive the Contract

Read the accepted technical decisions and verification seams in `SPEC.md`. If the target topology, dependency direction, boundaries, or public seams are absent or contradictory, return to `requirements-grill`; do not invent a competing target.

For backend scope, invoke `$backend-domain-structure` and read its layout reference. Derive honest feature,
platform/composition, integration, persistence, model, and public-boundary ownership from the repository.

For frontend scope, invoke `$frontend-domain-structure` and read its agnostic reference. Apply the invariant-owner,
domain-worthiness, public-entrypoint, one-way, and acyclic dependency rules. For React scope, also read its
React addendum and classify route composition, components, hooks, providers, and behavior-test seams.

For mixed scope, apply both theories at their respective boundaries. Preserve repository vocabulary and
existing honest owners. Completion requires every changed responsibility and dependency edge to be grounded
in the applicable theory and current code evidence.

## Persist the Architecture Contract

For an architecture-bearing plan, invoke `$show-me` while authoring **each persisted view** below. Save the
smallest visual that preserves exact owners, edges, order, labels, and uncertainty next to a terse textual
conclusion. These views are normative `PLAN.md` content, not a conversational summary.

### Target Ownership Topology

Show the target domains/modules and composition roots as a shallow tree or ownership map. For every owner,
state its responsibility, public entrypoint, owned paths, and responsibilities it must not absorb. Ownership
means semantic policy and behavior, not file placement alone.

### Declared Dependency Graph

Show every changed or newly relevant cross-owner edge. Label allowed edges with the public seam they traverse;
list forbidden static imports and forbidden semantic calls. Require one-way, acyclic dependencies and deliberate
public entrypoints under the applicable frontend/backend theory.

### Responsibility Acceptance Criteria

Give every target owner observable acceptance criteria proving that its policy, orchestration, persistence,
integration, transport, or presentation responsibility lives there. Include focused behavior and architecture
checks; file existence alone is insufficient evidence. Each criterion records a stable `criterion_id`, its
owner, observable assertion, evidence command or inspection, and `due_architecture_wave`. Every criterion id
must map to at least one task and exactly one due wave.

### Architecture Waves

Show ordered architecture waves separately from worker parallelism:

```text
boundary establishment
  vertical slice / caller migration
    continuous convergence checkpoint
      next slice
        continuous convergence checkpoint
          final closure
```

Each wave has a stable `architecture_wave` id distinct from worker `wave_boundary`; it names its topology delta,
entry dependencies, criterion ids due in that wave, allowed temporary seams, and checkpoint. Vertical delivery
remains behavior-complete; architecture work is not deferred wholesale to final closure.

### Public Seam Contract

Name each consumer-facing command, result, port, event, component, hook, or entrypoint affected by the plan;
list its owner and allowed consumers. A task that changes the declared public seam must amend the plan contract
before dependent work continues.

### Migration Ledger

For every temporary seam record its introducing task, reason, allowed consumers, removal task, expiry wave, and
removal proof. Undeclared temporary seams are drift. Final closure requires the migration ledger to be empty.

## Shape Continuous Convergence

Every architecture-bearing task declares `architecture_wave`, `behavior_owner`, `integration_surface`,
`public_seam`, `topology_delta`, `forbidden_ownership`, `temporary_seams`, and
`responsibility_acceptance_criteria`. Each architecture wave ends with a **continuous convergence checkpoint**
that compares cumulative implementation with all persisted views: actual ownership, allowed and forbidden edges,
public-seam amendments, topology delta, and migration-ledger additions/removals. The checkpoint evaluates every
criterion due through the current wave and regression-checks every criterion previously met. Missing, failing,
or regressed evidence blocks dependent waves.

Final closure confirms the target responsibilities, graph, public seams, and acceptance evidence; all migration
entries are removed. It is a zero-drift proof, not the first consolidation pass.
