---
name: rule-authoring
description: Maintain project-owned Codebase Rules after `hi init` or `hi update`. Use only from those post-command handoffs.
---

# Rule Authoring

Use with `$writing-for-agents`.

1. Read or create `.agents/rules/index.md`.
2. Keep one stable invariant per scope-grouped rule file. Require current Code Evidence or a linked accepted architecture decision.
3. Index each rule by stable id, scope, path trigger, task trigger, optional tags, and file. Tags aid discovery; the other triggers decide activation.
4. Write project rules in `.agents/rules/<scope>/`. Never write in `.agents/rules/packs/`: HI owns that folder, and `hi update` overwrites and prunes its Pack rules. Index each Pack rule with the row that `.devpunks/AGENT-HANDOFF.md` "Pack rules" gives, and remove the row of a Pack rule that the handoff no longer lists.
5. Keep scoped `AGENTS.md` files to scope, exact skill routing, and one exhaustive Rule Registry pointer.
6. Evaluate every activated rule as `pass`, `fail`, or `not-applicable` with evidence in the current handoff or work log.

Rule files contain: `id`, `authority`, one positive requirement, activation triggers, verification, and exceptions.

For an existing repository, follow [migration.md](references/migration.md). Completion means the index is exhaustive, every pointer resolves, and project-owned rules remain preserved.
