# Finder Router

Recompute one route on every entry. Runtime authority is the current provider
Fog, direct children, relations, provider objects, wiki identity, and immutable
evidence. Resolve conflicts in this order: current direct evidence, fresh
workflow-native artifacts, committed handoff, suggested route.

## Route Precedence

1. Durable `human_steering_required` while the `$handback` authority guard
   fails -> terminal `human_steering_required`.
2. Missing or invalid target depth -> [handback](handback.md).
3. Ambiguous or conflicting Fog, child, relation, or accepted-evidence identity;
   accepted Business evidence without exactly one exact child in the fresh
   complete collection; a Functional or Technical child missing its stable
   cardinality key; duplicate projected Story or Task identities; or incomplete
   Story/Task projection readback -> [handback](handback.md), with zero mutation
   intent.
4. No exact Fog readback -> [ensure-fog](ensure-fog.md).
5. Product Area or Initiative expansion lacks a split-or-proceed decision ->
   checkpoint `scope-expansion-checkpoint`; persist it and stop.
6. Current stage has selected unresolved Research support ->
   [research](research.md).
7. Current stage has selected unresolved Prototype support ->
   [prototype](prototype.md).
8. Functional or Technical depth starts from an exact accepted Product Area ->
   Initiative -> Epic path with an explicit `reuse-unchanged` decision but no
   Business child -> [adopt-business-path](adopt-business-path.md).
9. Business evidence is missing or invalid ->
   [business-grilling](business-grilling.md).
10. Accepted Business evidence lacks an exact child identity or immutable
    resolution pointer -> [handback](handback.md), with zero mutation intent.
11. Accepted Business evidence lacks exact projection readback ->
    [reconcile](reconcile.md).
12. Target depth is `Business` -> [return-target](return-target.md).
13. Accepted Functional evidence lacks an exact child identity or immutable
    resolution pointer -> [handback](handback.md), with zero mutation intent.
14. Accepted Functional evidence lacks one distinct stable projected Story
    identity and exact projection readback ->
    [reconcile](reconcile.md).
15. Required Functional evidence is missing or invalid ->
    [functional-grilling](functional-grilling.md).
16. Target depth is `Functional` -> [return-target](return-target.md).
17. A selected Technical Story is not the distinct projected Story of one
    selected accepted Functional child -> [handback](handback.md), with zero
    mutation intent.
18. Accepted Technical evidence lacks stable projected Task identities, exact
    parent and `V*` membership, or an exact `write-backlog` full-reachable Task
    graph validation bound to the current provider snapshot and milestone-order
    readback ->
    [reconcile](reconcile.md).
19. Any selected Story lacks valid Technical evidence ->
    [technical-grilling](technical-grilling.md).
20. Target depth is `Technical` -> [return-target](return-target.md).
21. Any other state -> [handback](handback.md).

Exactly one route is legal. A suggested route never breaks precedence. No route
marks the Fog complete.

## Output

Persist the selected gate or exact checkpoint, blocked, or terminal outcome in
the runtime handoff. A selected gate owns the next write; the router owns no
provider mutation.
