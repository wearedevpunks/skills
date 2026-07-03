# Root Routing

## Trigger

Route to `finder-phase` before `requirements-phase` when a loose idea is too large for one agent session and still wrapped in fog.

Use this route when the first question is not "which requirement is unclear?" but "what kind of work is this frontier?"

## Placement In Root Guidance

Keep root prompt guidance short:

- Foggy oversized work routes to `finder-phase` first.
- Unclear requirements inside a bounded topic route to `requirements-phase`.
- Accepted specs, issues, or plans route to `delivery-phase`.
- Runtime failures route to `debugging-phase`.
- Reviews route to `review-phase`.
- Docs learning after proven changes routes to `docs-ingest-phase`.

## Boundary

`finder-phase` should not replace:

- `requirements-phase` for human decision closure inside a known topic.
- `parallel-research` for split-friendly readonly investigation.
- `prototype` for artifact-driven learning.
- `create-spec`, `create-plan`, or `delivery-phase` after implementation scope is accepted.

It chooses the route and updates the frontier handoff.
