---
name: wayfinder
description: Route a foggy decision frontier. Use when work is too unclear for requirements, too broad for one delivery session, or needs classification as fog, grilling, research, prototype, epic, or story.
---

# Wayfinder

Lean route-selection primitive for unclear work.

`wayfinder` selects the next concept and route. It does not write provider
payloads, create specs, plan implementation, or own backlog schema.

## Route Selection

1. Name the frontier.
   - Capture the loose idea, current evidence, and why it is too foggy or broad for immediate delivery.

2. Inspect the current operating surface.
   - Prefer provider backlog state when available.
   - Treat docs, specs, grill logs, and notes as evidence, not the living map.

3. Classify the next item.
   - `fog`: root-level uncertainty; no capability module or execution shape is clear yet.
   - `grilling`: a human decision must close ambiguity.
   - `research`: readonly investigation can answer the unknown.
   - `prototype`: learning requires an artifact or experiment.
   - `epic`: post-spec capability projection.
   - `story`: accepted product-facing slice belongs under an epic.

4. Choose placement.
   - Keep `fog` at the backlog root.
   - For every non-fog item, choose or propose a capability module first.
   - Keep stories under epics.
   - Execution milestones are separately blocker-derived chronology; they do
     not determine capability placement.

5. Return a route.
   - State the selected concept, placement, evidence, unresolved questions, and recommended next skill.

## Completion Criteria

- One route is selected.
- The selected concept is one of `fog`, `grilling`, `research`, `prototype`, `epic`, or `story`.
- Provider materialization is explicitly delegated to `write-backlog` when backlog writes are needed.
- The handoff says whether the next move is requirements, research, prototype, backlog writing, spec creation, or delivery.
