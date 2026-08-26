---
name: finder-phase
description: Run the shared human-driven Finder engine at an explicit target depth.
disable-model-invocation: true
---

# Finder Engine

One durable graph creates or resumes one Fog and advances it to the human's
chosen decision depth. The three Finder wrappers compose this engine directly;
they do not own lifecycle state.

## Bootstrap

1. Read [the direct-composition contract](references/entrypoint-contract.md).
2. Read [the state and route model](references/state-graph.md) before deriving
   any state.
3. Read [the runtime handoff schema](references/runtime-handoff.md) before
   discovering or updating a Finder handoff.
4. Reconstruct current state from fresh Fog, child, relation, provider-object,
   immutable-evidence, and runtime-handoff reads.
5. Read [the Finder router](phases/router.md) on every entry and cold resume.
6. Load exactly one gate selected by the router, or return its one checkpoint,
   blocked, or terminal outcome.
7. After the gate writes its durable handoff, stop or re-enter this bootstrap.

The router is the sole route authority. Gate files own executable work.
`write-backlog` is the sole provider mutation authority.

## Gates

- [Ensure Fog](phases/ensure-fog.md)
- [Adopt exact Business path](phases/adopt-business-path.md)
- [Business grilling](phases/business-grilling.md)
- [Functional grilling](phases/functional-grilling.md)
- [Technical grilling](phases/technical-grilling.md)
- [Research support](phases/research.md)
- [Prototype support](phases/prototype.md)
- [Reconcile stage](phases/reconcile.md)
- [Return target depth](phases/return-target.md)
- [Human steering](phases/handback.md)

## Runtime References

- [State and route model](references/state-graph.md)
- [Runtime handoff](references/runtime-handoff.md)
- [Root routing boundary](references/root-routing.md)
