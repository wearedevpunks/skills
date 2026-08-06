# Requirements Router

## Selection Condition

Load this file on every entry and cold resume. Reconstruct state from the active planning surface without relying on transcript continuity.

## Evidence Authority

1. Current direct evidence.
2. Fresh, valid, in-scope workflow-native artifacts.
3. Corroborated fields in `<planning-surface>/REQUIREMENTS-HANDOFF.md`.
4. Its next suggested route, as advisory evidence only.

Discard stale, invalid, out-of-scope, or contradictory evidence before routing. A handoff never makes its own suggestion authoritative.

## Route Selection

Inspect current grill artifacts and confirmation, the retained `SPEC.md`, immutable spec identity, provider projection evidence, and the runtime handoff. Select exactly one route in this precedence order:

1. A current material need for research or prototype evidence -> terminal `finder-required`.
2. Open human decisions or missing shared-understanding confirmation -> [`requirements-grill.md`](requirements-grill.md).
3. Decisions are closed or explicitly parked, but no valid retained agent-ready spec exists -> [`create-spec.md`](create-spec.md).
4. A valid retained agent-ready spec exists, but no verified current projection matches that exact spec -> [`write-backlog.md`](write-backlog.md).
5. The valid retained spec and its verified matching projection both exist -> terminal `requirements-complete`.

When evidence becomes stale, return to the earliest unmet gate in `requirements-grill -> create-spec -> write-backlog` order. The router selects only; the selected gate owns delegation and mutation.

## Output

Return exactly one gate filename or terminal route with the evidence that satisfied its guard. Stop after returning a terminal. For a gate, load only that file.
