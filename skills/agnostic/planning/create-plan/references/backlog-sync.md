# Backlog Sync

Use this reference after the plan structure is complete.

## Sync rules

Use the canonical backlog model from [../../write-backlog/assets/concepts/backlog-model.md](../../write-backlog/assets/concepts/backlog-model.md).

Sync backlog at epic/story level, not at plan-task level.

Defaults:

- epic = one future `SPEC.md`
- story = product-facing backlog item
- task = internal `PLAN.md` execution unit only

Task rules:

- every task stores the owning story in `backlog_item_id` / `backlog_item_url`
- multiple tasks may reference the same story
- do not create a new backlog item only because a story needs multiple execution tasks

Create or update backlog items only when:

- a required product-facing epic is missing
- a required product-facing story is missing
- native story blockers/order need sync
- epic/story links to spec or plan context need refresh

Do not turn epic or story bodies into execution handoffs.

If planning needs to backfill detail into the backlog:

- prefer native hierarchy, blockers, state, labels, and links
- keep bodies product-facing
- reserve execution detail for repo artifacts

Track hierarchy and dependencies natively when supported.

Only use prose fallback when the provider cannot express the primitive natively.

Record referenced or created epic/story ids and URLs back into the plan.

Prefer the selected backlog system's native CLI or tool when available.
