---
name: finder-phase
description: Route loose oversized foggy work before requirements or delivery. Use when an idea is too large for one agent session, wrapped in fog, or needs backlog-native frontier shaping before requirements-phase.
---

# Finder Phase

Harness phase wrapper for backlog-native frontier routing.

Use this before `requirements-phase` when the work is too big or foggy to grill
directly. Compose the lean `wayfinder` primitive and preserve a resumable map.

## Core Loop

1. Choose a destination and mode. In **chart mode**, repair the map and sharpen
   fog. In **work mode**, claim and execute exactly one frontier ticket.
2. Read the backlog root plus any resumable ticket and immutable evidence links.
   If provider state is unavailable, use docs as temporary evidence and say so.
3. Use `wayfinder` to compute the frontier and select one route.
4. In chart mode, use `write-backlog` only when provider mutation is in scope.
   In work mode, produce a claim and use `write-backlog` for its physical
   provider mutation before dispatching one bounded child flow.
5. Reconcile the child result semantically, repair invalidated scope, recompute
   the frontier, and return the next route or completion state.

## Always-Needed Rules

- The backlog root is the living map; do not create a separate map issue.
- `fog` is not delivery-eligible and is not a `SPEC.md` anchor.
- A `fog` item records a frontier or uncertainty description. Once Finder can
  derive a precise question, graduate it into `grilling`, `research`, or
  `prototype`; the question belongs to that concrete item, not the fog intake.
- The materialization handoff supplies the source fog parent for every
  Finder-derived `grilling`, `research`, or `prototype` item. `write-backlog`
  selects the provider-supported evidence-parent representation.
- Frontier tickets are open, unblocked, and unclaimed. Dependencies and claims
  use provider-native relations and assignment/state.
- Child flows return immutable resolution pointers. Finder produces semantic
  claim/resolution outputs; `write-backlog` owns their provider writes. The phase does not infer a
  product decision from research or impersonate the human in grilling or
  prototyping.
- `finder-phase` owns frontier lifecycle and root routing; `write-backlog` owns provider materialization.

## References

- Frontier lifecycle: [references/frontier-lifecycle.md](references/frontier-lifecycle.md)
- Convergence and resumption: [references/convergence.md](references/convergence.md)
- Root routing: [references/root-routing.md](references/root-routing.md)
- Backlog taxonomy and provider materialization: use the `write-backlog` skill.

## Completion Criteria

- The frontier is represented as backlog-root state or as a temporary evidence-backed handoff when provider state is unavailable.
- The destination, current mode, frontier, claims, and next route are explicit.
- Any backlog writes were delegated to `write-backlog`.
- The final handoff names the next skill or phase and any unresolved blocker.
