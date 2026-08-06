# Root Routing

## Trigger

Route to `finder-phase` before `requirements-phase` when a loose idea is too large for one agent session and still wrapped in fog.

Use this route when the first question is not "which requirement is unclear?"
but "which concept and child flow can close this frontier?"

## Placement In Root Guidance

Keep root prompt guidance short:

- Foggy oversized work routes to `finder-phase` first.
- Unclear requirements inside a bounded topic route to `requirements-phase`.
- Accepted specs, issues, or plans route to `delivery-phase`.
- Runtime failures route to `debugging-phase`.
- Reviews route to `review-phase`.
- Docs learning after proven changes routes to `docs-ingest-phase`.

## Boundary

Each selected route keeps its own contract:

- `requirements-phase` owns decision closure and requirements readiness inside a
  known topic.
- `parallel-research` owns split-friendly readonly investigation.
- `prototype-phase` owns human-evaluated artifact-driven learning.
- `delivery-phase` owns accepted implementation work beginning at planning.

It chooses the route and updates the frontier handoff.
