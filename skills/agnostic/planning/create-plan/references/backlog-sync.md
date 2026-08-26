# Backlog Sync

Use this reference only when an authoritative agent-ready `SPEC.md` exists at a
verified stable blob URL and `write-backlog` has projected it into
provider-native delivery items. Concrete planning follows exact provider
readback.

Backlog sync is eligible and in scope when the planning input retains that spec, its
projection relation, and a request to maintain the relation. A planning-only
request without retained projection records an explicit skip reason in
`PLAN.md`.

## Task identity handoff

Use the backlog model owned by `write-backlog` at
[backlog-model.md](https://github.com/wearedevpunks/skills/blob/main/skills/agnostic/requirements/write-backlog/assets/concepts/backlog-model.md).
Read its [technical projection
branch](../../../requirements/write-backlog/references/technical-projection.md)
when the handoff includes implementation Tasks. Those references own taxonomy,
readiness, Task splitting, milestone rules, provider mutation, and readback.

Provider Tasks are the one execution graph. Before task synthesis, require the
exact `write-backlog` readback for every reachable Task:

- stable provider Task ID and URL
- stable parent Story identity and the same contextual `V*`
- native blocker edges resolved by stable provider Task ID
- immutable spec and Fog provenance links

`Tn` is a short plan alias for exactly one provider Task. Copy its ID into
`backlog_item_id`, its URL into `backlog_item_url`, and translate each native
blocker edge into `depends_on` through that one-to-one alias map. Preserve the
Task's same `V*` membership in the plan context. Worker waves derive from these
provider Tasks and native blockers, with disjoint `owned_paths` deciding which
unblocked Tasks may run in parallel.

Planning cannot create a second Task identity or private execution graph. When
a required provider Task, milestone membership, parent, source link, or blocker
edge is missing or stale, route the delta through `write-backlog` and resume
only from its exact readback. Planning performs no provider mutation.

## Completion criterion

Backlog sync is complete when every `Tn` resolves one stable provider Task ID
and URL, every `depends_on` mirrors one native blocker edge, every Task retains
its Story's `V*`, and provider readback proves the graph. Keep files, commands,
tests, workers, and validation evidence in `PLAN.md`; keep provider bodies
owner-ready and product-facing through `write-backlog`.
