# Finder State Graph

## Evidence Authority

1. Current direct provider, repository, and wiki evidence.
2. Fresh workflow-native artifacts and immutable resolution pointers.
3. Valid committed runtime handoff.
4. Suggested route.

The first admissible signal wins. Stale, invalid, ambiguous, or out-of-scope
evidence cannot satisfy a gate.

## Topology

```text
ensure-fog
  -> (business-grilling <-> research | prototype) | adopt-business-path
  -> reconcile
  -> return-target [Business]
  -> functional-grilling <-> research | prototype
  -> reconcile
  -> return-target [Functional]
  -> technical-grilling per Story <-> research | prototype
  -> reconcile
  -> return-target [Technical]

any identity or authority conflict -> handback -> human_steering_required
scope boundary expansion -> scope-expansion-checkpoint -> router re-entry
```

`adopt-business-path` is available only for Functional or Technical depth when
the human supplies exact provider readback for one Product Area -> Initiative
-> Epic path and accepts `reuse-unchanged`. It creates the required Business
child and immutable resolution without a Business grill, then rejoins normal
reconciliation.

`return-target` is successful return from this invocation, not Fog completion.
The Fog remains open until separate production evidence covers all accepted
resulting Stories and Tasks.

## State Evidence

For each stage, record `missing`, `active`, `accepted`, or `invalid`; its exact
child identity; immutable resolution pointer; supported-by relations; intended
semantic projection; and exact provider readback. Accepted state without an
exact child identity or immutable pointer is an authority conflict. Business
completion requires exactly one valid Business child from the fresh complete
direct-child collection and exact Product Area -> Initiative -> Epic identity
and hierarchy readback. Functional completion requires each Story's exact
parent Epic, contextual `V*` milestone membership, and Fog/source links. Every
selected Technical Story must equal the distinct projected Story of one
selected accepted Functional child. Technical completion also requires every
Task to retain its Story milestone and the exact successful result of
`write-backlog`'s provider-neutral validator over the full reachable Task
graph, resolved milestone order, and current provider snapshot. The result must
cover every projected Task and outgoing edge. It rejects future-iteration,
self, missing-target, duplicate, and cyclic edges while preserving valid
same-or-earlier-milestone blockers across Stories and Epics. Invalid stage
evidence routes to that stage again. Accepted evidence without readback routes
to reconciliation.
