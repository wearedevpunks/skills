---
name: finder-phase
description: Route loose oversized foggy work before requirements or delivery. Use when an idea is too large for one agent session, wrapped in fog, or needs backlog-native frontier shaping before requirements-phase.
disable-model-invocation: true
---

# Finder Phase

Harness phase wrapper for backlog-native frontier routing.

Use this before `requirements-phase` when the work is too big and too foggy to grill directly. Compose the lean `wayfinder` primitive, then delegate backlog materialization to `write-backlog`.

## Core Loop

1. Establish the frontier.
   - Name the loose idea, known evidence, backlog root, and any current fog or learning tickets.
   - If the living backlog is unavailable, say so and use docs only as temporary evidence.

2. Run route selection.
   - Use `wayfinder` to classify the next kind: `fog`, `grilling`, `research`, `prototype`, `epic`, or `story`.
   - Keep provider payload rules out of this phase.

3. Place the route.
   - Keep `fog` at the backlog root.
   - For concrete non-fog work, choose or propose a module/milestone before backlog writing.
   - Preserve epic/story delivery semantics.

4. Materialize only when asked or already in scope.
   - Use `write-backlog` for backlog taxonomy and provider payloads.
   - Do not create provider tickets when the user asked only for routing.

5. Close the frontier pass.
   - Produce the updated frontier, selected route, evidence, open questions, and concise handoff.

## Always-Needed Rules

- The backlog root is the living map; wiki and grill artifacts are evidence.
- `fog` is not delivery-eligible and is not a `SPEC.md` anchor.
- `grilling`, `research`, and `prototype` must close into accepted decisions before they create or update implementation epics or stories.
- `finder-phase` owns frontier lifecycle and root routing; `write-backlog` owns provider materialization.

## References

- Frontier lifecycle: [references/frontier-lifecycle.md](references/frontier-lifecycle.md)
- Root routing: [references/root-routing.md](references/root-routing.md)
- Backlog taxonomy and provider materialization: use the `write-backlog` skill.

## Completion Criteria

- The frontier is represented as backlog-root state or as a temporary evidence-backed handoff when provider state is unavailable.
- The next route is selected and placed.
- Any backlog writes were delegated to `write-backlog`.
- The final handoff names the next skill or phase and any unresolved blocker.
