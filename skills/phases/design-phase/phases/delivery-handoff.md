# Delivery Handoff

## Entry Guard

Enter only when the router selected this gate: backlog identities link the
promote commit and the delivery brief is missing or stale.

## Inputs

- the promote commit SHA and its Design-Owned UI Code file list
- backlog identities and URLs
- approved artifact contracts and durable asset links
- the Design Target section: surfaces and scope units
- accepted constraints and acceptance checks

## Actor-Like Gate Boundary

Delivery-handoff owns the delivery brief. It delegates nothing and never
loads or starts `delivery-phase`; only the user invokes it.

## Bounded Action

1. Build the delivery brief: the promote commit, backlog identities, approved
   artifact links, target surfaces, scope units, constraints, and acceptance
   checks.
2. State the delivery boundary in the brief: the UI is committed; the
   Design-Owned UI Code of the promote commit is accepted input; delivery
   adds logic, data, and the rest of the requirement; delivery changes a
   design-owned file only as a recorded defect fix.
3. Include browser or screenshot validation expectations, and before/after PR
   evidence guidance with durable links through `repo-asset-management`.
4. Present the brief, tell the user to invoke `$delivery-phase` explicitly
   with it, and stop.

## Invariants

- Design approval stays closed during delivery unless artifacts are stale or
  contradicted; a later visual change re-enters `design-phase`.
- Final evidence uses durable links; local temp files and transient browser
  URLs are pending evidence only.

## Completion Evidence

- the presented brief with every field from steps 1 to 3

## Declared Exits

- `complete` `delivery_brief_ready`: the brief is presented; the next action
  is the user's explicit invocation of `$delivery-phase`.
- `blocked` `delivery_brief_input_missing`: a brief field has no fresh source;
  the record names it.
- `human_steering_required`: the brief would contradict the backlog or the
  specification; the record names the decision needed.

## Durable Handoff

Write the brief and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

Stop after every exit. A later invocation re-enters [`router.md`](router.md),
which returns `design_complete` while the brief stays fresh.
