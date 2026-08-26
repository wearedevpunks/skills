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
  -> business-grilling <-> research | prototype
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

`return-target` is successful return from this invocation, not Fog completion.
The Fog remains open until separate production evidence covers all accepted
resulting Stories and Tasks.

## State Evidence

For each stage, record `missing`, `active`, `accepted`, or `invalid`; its exact
child identity; immutable resolution pointer; supported-by relations; intended
semantic projection; and exact provider readback. Invalid accepted evidence
routes to that stage again. An accepted stage without readback routes to
reconciliation.
