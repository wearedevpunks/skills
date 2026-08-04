# Backlog Sync

Use this reference only when an authoritative agent-ready `SPEC.md` exists at a verified stable blob URL and `write-backlog` has projected or must project it into provider-native delivery items. Concrete planning is downstream from both the spec and backlog projection.

## Sync rules

Use the backlog model owned by `write-backlog` at [backlog-model.md](../../../requirements/write-backlog/assets/concepts/backlog-model.md). Do not restate its readiness, taxonomy, traceability, or mutation contracts here.

Sync at epic/story level, never at plan-task level:

- epic = capability-boundary projection of one existing spec
- story = product-facing tracer bullet derived from `US-###` / `AC-###`
- task = internal `PLAN.md` execution unit

Plan tasks reference their owning story through `backlog_item_id` and `backlog_item_url`. Multiple tasks may reference one story. Never create another backlog item merely because delivery needs several execution tasks.

Create or update backlog items only through `write-backlog`, and only when:

- a required epic or story projection is missing
- native story blockers need correction
- immutable spec or plan links need refresh

Keep bodies product-facing. Store files, commands, test cases, worker assignments, and implementation sequencing in `PLAN.md`.

Record referenced or created epic/story ids and URLs in the plan. Use the selected provider's native CLI or tool when available.
