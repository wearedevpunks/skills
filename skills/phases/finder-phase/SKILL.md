---
name: finder-phase
description: Route loose oversized foggy work before requirements or delivery. Use when an idea is too large for one agent session, wrapped in fog, or needs backlog-native frontier shaping before requirements-phase.
---

# Finder Phase

Harness phase wrapper for top-level lifecycle routing.

Lifecycle: `fog/charting -> research | prototype | requirements-phase -> delivery-phase -> complete`.

Use this before `requirements-phase` when the work is too big or foggy to grill
directly. Compose the lean `wayfinder` primitive and preserve a resumable map.

## Core Loop

1. Choose a destination and mode. In **chart mode**, repair the map and sharpen
   fog. In **work mode**, reconcile one returned child result.
2. Read the backlog root plus any resumable ticket and immutable evidence links.
   If provider state is unavailable, use docs as temporary evidence and say so.
3. Use `wayfinder` to compute the frontier and select one top-level route.
4. Run bounded `parallel-research` during charting when readonly evidence can
   sharpen the frontier. Return explicit handoffs for lifecycle phases.
5. Reconcile returned evidence, repair invalidated scope, recompute
   the frontier, and return the next route or completion state.

The operator activates each returned `prototype-phase`, `requirements-phase`,
or `delivery-phase` handoff. Finder resumes from that phase's returned evidence.

## Always-Needed Rules

- The backlog root is the living map; do not create a separate map issue.
- `fog` is not delivery-eligible and is not a `SPEC.md` anchor.
- A `fog` item records a frontier or uncertainty description. Once Finder can
  derive a precise question, graduate it into `grilling`, `research`, or
  `prototype`; the question belongs to that concrete item, not the fog intake.
- Frontier tickets are open, unblocked, and unclaimed.
- Child workflows return immutable resolution pointers. Finder reconciles those
  results and keeps product decisions with the human.
- `finder-phase` owns frontier lifecycle and top-level route selection. Each
  selected lifecycle phase owns its internal gates and mutations.

## References

- Frontier lifecycle: [references/frontier-lifecycle.md](references/frontier-lifecycle.md)
- Convergence and resumption: [references/convergence.md](references/convergence.md)
- Root routing: [references/root-routing.md](references/root-routing.md)

## Completion Criteria

- The frontier is represented as backlog-root state or as a temporary evidence-backed handoff when provider state is unavailable.
- The destination, current mode, frontier, and next route are explicit.
- The final handoff names one next lifecycle phase or completion state and any
  unresolved blocker.
