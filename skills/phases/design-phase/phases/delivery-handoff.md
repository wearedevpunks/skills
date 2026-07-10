# Delivery Handoff Phase

Prepare approved design context for explicit user invocation of `$delivery-phase`.

## Prerequisite

Fresh backlog ids plus approved artifact set links.

## Steps

1. Build the delivery brief: backlog ids, approved artifact links, target surfaces, scope units, constraints, and acceptance checks.
2. Include frontend taste skills expected during implementation: `design-taste-frontend`, `gpt-taste`, and relevant web/mobile image or prototype context.
3. Include browser or screenshot validation expectations.
4. Include before/after PR evidence guidance and require durable links through `repo-asset-management`.
5. Present the delivery brief, tell the user to invoke `$delivery-phase` explicitly with it, and stop.

## Rules

- `delivery-handoff` does not load or start `delivery-phase`; only the user can invoke it explicitly.
- Do not re-open design approval during delivery unless artifacts are stale or contradicted.
- Local temp files and transient browser URLs are not final evidence.

## Output

- Delivery handoff brief.
- Backlog ids.
- Approved artifact links.
- Before/after evidence expectations.
- Phase handoff with next action: explicit user invocation of `$delivery-phase`.
