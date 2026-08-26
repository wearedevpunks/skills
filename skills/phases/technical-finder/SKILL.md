---
name: technical-finder
description: Resolve Story delivery through cumulative Business, Functional, and Technical grilling.
disable-model-invocation: true
---

# Technical Finder

Human entrypoint for a technical user. Close technical requirements for
accepted Stories without taking ownership of implementation or provider writes.

## Composition

Directly compose [the Finder engine](../finder-phase/SKILL.md) with target
depth: `Technical`. This is cumulative Business, Functional, and Technical
depth over one Fog; this adapter supplies only its audience, presentation, and
return profile. The engine's [Technical gate](../finder-phase/phases/technical-grilling.md)
owns the executable per-Story sequence and durable state.

## Story-scoped presentation

Let the engine validate and reuse fresh accepted Business and Functional
stages. It resumes the first missing or invalidated stage and selects one Story
at a time for Technical resolution.

Present the selected gate's evidence in its authoritative order:

1. Reuse or allocate the durable Technical child identity for the exact Fog,
   Stage `Technical`, and stable Story identity; show the `$write-backlog`
   child-shell ensure and exact readback.
2. Open or resume exactly one durable full `$requirements-grill` once per Story.
3. Show the immutable accepted resolution persisted on that Technical child.
4. Show `$create-spec` returning `readiness: agent-ready` and a verified stable
   blob URL.
5. Show the nonempty Task intent derived from that specification.
6. Show the `$write-backlog` Technical projection and exact Task/relation
   readback.
7. Re-enter the Finder router so accepted pending projection reconciles before
   the next Story is selected.

A Technical child shell exists before `$requirements-grill` and cannot
authorize projection. Preserve the same child and requirements artifacts on
resume. A duplicate or ambiguous child returns zero writes and human steering.
`spec-not-ready`, a missing verified blob, or an empty Task intent returns zero
Technical projection through the engine's declared handback route.

This wrapper advances none of those steps itself. `$requirements-grill` owns
decision closure, `$create-spec` owns specification compilation, and
`$write-backlog` remains the sole physical provider mutation and readback
authority.

## Task projection

The semantic intent carries the exact Story and milestone, immutable Technical
resolution and specification URL, a nonempty Task set, and the complete intended
blocker graph. Each proposed responsibility must be atomic and independently
owner-ready. `$write-backlog` validates the full reachable graph, same-`V*`
membership, cross-Story or cross-Epic blockers, and provider representation
before it writes anything.

Use `$show-me` to present the Story boundary, accepted specification, proposed
Task split, parallel work, and blocker topology. Preserve writer-owned approval
gates and return its exact rejection, partial-write, or readback evidence to the
Finder engine without implementing provider mechanics here.

## Return

At `target_depth_reached`, return the exact Fog identity, all stage children and
their immutable pointers, resolved product path and Stories, specification URLs,
Task IDs and URLs, blocker edges, milestone membership, exact readback, support
evidence, unresolved decisions, and durable Finder handoff.

Reaching Technical depth does not complete the Fog. Return its remaining
production-evidence obligations so delivery can prove completion later.
