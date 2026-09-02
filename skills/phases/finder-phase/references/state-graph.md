# Finder State Graph

## Evidence authority

1. Current direct evidence: exact provider objects, relations, immutable
   evidence, and the human's current decision.
2. Fresh workflow-native artifacts within the current Fog scope.
3. A committed runtime handoff consistent with current evidence.
4. A suggested route, which is advisory only.

Stale, out-of-scope, ambiguous, or conflicting evidence satisfies no positive
guard. Recompute from this order on every entry and cold resume.

## Topology

```text
ensure-fog
  -> grilling <-> research | prototype
  -> optional reconcile
  -> bounded return

identity, lens, selection, or ceiling conflict
  -> handback -> human_steering_required
```

One Fog retains its immutable original Business or Functional intake lens.
Generic Grilling children have no fixed count and no staged ordering. Research
and Prototype are direct Fog children linked to the Grilling child they support.

The wrapper decides whether optional structure is useful and supplies the
ceiling. Business permits Product Area and Initiative. Functional permits that
Business structure plus Epic. Missing or unresolved optional projection never
invalidates an otherwise valid Fog return.

Historical Business, Functional, or Technical Stage fields remain read-only
compatibility evidence and are not a current gate, prerequisite, or migration
trigger. On bounded return the Fog remains open; delivery evidence owns later
completion truth.
