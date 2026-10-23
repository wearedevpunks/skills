---
name: requirements-grill
description: Requirements grilling in Altitude-routed rounds (L1 Outcome, L2 Shape, L3 Modules) with durable grill log and status, glossary and axiom decisions, and wiki synthesis after closure. Use when the user wants requirements discovery, a long design interview, branch-by-branch decision closure down to module level, canonical terminology, a compaction-safe grill, or wiki synthesis from closed grill decisions; or when a Brainstorm Brief or a compile gap is handed to the grill.
---

# Requirements Grill

A Durable Workflow Graph. It asks every requirements question round, routes
each round to one Altitude, and closes when every branch is settled at its
Target Altitude or parked. The closed grill feeds `create-architecture`, then
`create-spec`.

## Bootstrap

1. Load [the grill router](phases/router.md) on every invocation and resume,
   including direct entry into any gate.
2. Recompute the route from the precision inputs, the grill status file and
   log, and the current message; the transcript is never required.
3. Load exactly the one gate the router selects, or return its single
   terminal, checkpoint, or blocked outcome.
4. After the gate writes its outcome to the status file, stop or re-enter
   this bootstrap.

The router is the sole route authority and the single home of the
[Altitude Ladder](phases/router.md#altitude-ladder). Gate files own executable
work and every child-skill call:

- `ground`: facts through subagents, Brainstorm Brief import, and branch
  Altitudes; it never asks the user.
- `round`: one `$grilling` round at one Altitude, presented through
  `$wait-what` with a `$show-me` view; `$wayfinder` for one stuck unknown.
- `checkpoint`: records each response set, runs `$domain-modeling` and
  `$flow-lenses`, expands each answer into same-Altitude follow-ups, derives
  next-level questions once a level settles, and records each required
  call's evidence.
- `close`: confirmation, final `$domain-modeling`, `$show-me` of the persisted
  understanding, wiki synthesis, and the `$create-architecture` handoff.

The grill status file and log are the requirements record:
[artifact output](references/artifact-output.md). Synthesized project pages
come only after explicit closure: [wiki output](references/wiki-output.md).
