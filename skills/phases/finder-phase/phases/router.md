# Finder Router

Recompute exactly one route from current evidence on every entry and cold
resume. Read current direct evidence from provider and human decisions first, then fresh
workflow-native artifacts, then a consistent committed runtime handoff. A
suggested route is advisory only.

## Route precedence

1. Unsupported intake lens, explicit steering state, ambiguous Fog identity,
   conflicting immutable-lens evidence, duplicate child identity, ambiguous child choice,
   unsupported support kind, or projection above the wrapper ceiling ->
   [handback](handback.md).
2. No exact Fog readback -> [ensure-fog](ensure-fog.md).
3. One unresolved Research child -> [research](research.md).
4. One unresolved Prototype child -> [prototype](prototype.md).
5. Accepted optional projection intent lacks final readback ->
   [reconcile](reconcile.md).
6. The wrapper's bounded result is ready ->
   [return-target](return-target.md).
7. Otherwise -> [grilling](grilling.md).

Reuse and create decisions both enter the Grilling or support gate. The selected
gate reads the evidence-backed decision and performs only that action. Genuine
ambiguity reaches `human_steering_required` before any creation request.

## Output

Persist the selected gate or terminal outcome in the runtime handoff. The
router performs no provider mutation and makes no Fog-completion claim.
