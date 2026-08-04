# Convergence

## Resume Input

Resume from the backlog root, destination, current mode, claimed ticket, native
dependencies, and immutable child-flow resolution pointers. Re-read provider
state; a prose handoff is evidence, not authoritative map state.

## Child Dispatch

- `grilling` -> `requirements-grill`; only the human closes product decisions.
- `research` -> `parallel-research` in durable-report mode; require the retained
  report's immutable commit SHA and path. Facts may close, product direction may
  not.
- `prototype` -> `prototype-phase`; wait for a human verdict.
- closed or explicitly parked frontier -> `create-spec`.

Dispatch one bounded child flow per work session.

## Provider Mutation Boundary

A claim is a semantic output of Finder: ticket, claimant, and intended native
assignment/state change. When provider mutation is in scope, delegate that
physical write to `write-backlog` and confirm it before child dispatch.

A resolution is a semantic output of Finder: ticket, result, immutable evidence
pointer, and intended native state change. Delegate the physical resolution
write to `write-backlog` and confirm it before recomputing the frontier.

## Reconciliation

1. Verify the child result and immutable evidence pointer.
2. Produce the semantic resolution and route its provider-native write through
   `write-backlog`.
3. Repair claims, dependencies, or scope invalidated by the result.
4. Move newly discovered out-of-scope work to the appropriate backlog root or
   explicitly park it; never smuggle it into the active destination.
5. Graduate newly precise fog and recompute open, unblocked, unclaimed tickets.
6. Return the next ticket, a chart-mode repair, or a closed frontier.
