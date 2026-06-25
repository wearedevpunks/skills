# Delivery Handoff Phase

Activate `delivery-phase` with approved design context.

## Prerequisite

Fresh backlog ids plus approved artifact set links.

## Steps

1. Build the delivery brief: backlog ids, approved artifact links, target surfaces, scope units, constraints, and acceptance checks.
2. Include frontend taste skills expected during implementation: `design-taste-frontend`, `gpt-taste`, and relevant web/mobile image or prototype context.
3. Include browser or screenshot validation expectations.
4. Include before/after PR evidence guidance and require durable links through `repo-asset-management`.
5. Load `delivery-phase` and start it with this brief.

## Rules

- `delivery-handoff` starts `delivery-phase`; it is not a passive recommendation.
- Do not re-open design approval during delivery unless artifacts are stale or contradicted.
- Local temp files and transient browser URLs are not final evidence.

## Output

- Delivery activation brief.
- Backlog ids.
- Approved artifact links.
- Before/after evidence expectations.
- Phase handoff with next route: active `delivery-phase`.
