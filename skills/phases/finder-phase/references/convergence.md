# Convergence

## Resume Input

Resume from the backlog root, destination, current mode, and immutable child-flow
resolution pointers. Re-read direct evidence; a prose handoff is evidence, not
authoritative map state.

## Child Dispatch

- `research` -> `parallel-research` in durable-report mode; require the retained
  report's immutable commit SHA and path. Facts may close, product direction may
  not.
- Prototype evidence needed -> return an explicit `prototype-phase` handoff.
- Bounded requirement decisions remain -> return an explicit
  `requirements-phase` handoff.
- A verified `requirements-complete` result -> return an explicit `delivery-phase`
  handoff.

Run at most one bounded research flow per charting pass. For lifecycle phases,
return the selected handoff and wait for its result before reconciliation.

## Reconciliation

Treat a `finder-required` result as a request to reconcile new discovery
evidence, then use `wayfinder` to recompute the frontier.

A verified delivery closeout with exit `done` lets Finder return `complete`.

1. Verify the child result and immutable evidence pointer.
2. Repair dependencies or scope invalidated by the result.
3. Move newly discovered out-of-scope work to the appropriate backlog root or
   explicitly park it; never smuggle it into the active destination.
4. Use `wayfinder` to recompute open, unblocked, unclaimed frontier work after fog
   graduates.
5. Return the next explicit lifecycle handoff, another bounded research route,
   or `complete`.
