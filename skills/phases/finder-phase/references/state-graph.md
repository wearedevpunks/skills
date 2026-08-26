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
exact child identity or immutable pointer is an authority conflict. Invalid
stage evidence routes to that stage again. Accepted evidence without readback
routes to reconciliation.
