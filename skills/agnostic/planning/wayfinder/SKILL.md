---
name: wayfinder
description: Route a foggy frontier into the next planning kind. Use when work is too unclear for requirements, too broad for one delivery session, or needs classification as fog, grilling, research, prototype, epic, or story before backlog writing.
---

# Wayfinder

Lean route-selection primitive for unclear work.

`wayfinder` decides the next work kind. It does not write provider payloads, create specs, plan implementation, or own backlog schema. Use `write-backlog` when the route must become provider items.

## Route Selection

1. Name the frontier.
   - Capture the loose idea, current evidence, and why it is too foggy or broad for immediate delivery.

2. Inspect the current operating surface.
   - Prefer provider backlog state when available.
   - Treat docs, specs, grill logs, and notes as evidence, not the living map.

3. Classify the next item kind.
   - `fog`: root-level uncertainty; no module or execution shape is clear yet.
   - `grilling`: a human decision must close ambiguity.
   - `research`: readonly investigation can answer the unknown.
   - `prototype`: learning requires an artifact or experiment.
   - `epic`: accepted implementation capability can anchor one future `SPEC.md`.
   - `story`: accepted product-facing slice belongs under an epic.

4. Choose placement.
   - Keep `fog` at the backlog root.
   - For every non-fog kind, choose or propose a module/milestone first.
   - Keep stories under epics.

5. Return a route.
   - State the selected kind, placement, evidence, unresolved questions, and recommended next skill.

## Completion Criteria

- One route is selected.
- The selected kind is one of `fog`, `grilling`, `research`, `prototype`, `epic`, or `story`.
- Provider materialization is explicitly delegated to `write-backlog` when backlog writes are needed.
- The handoff says whether the next move is requirements, research, prototype, backlog writing, spec creation, or delivery.
