# Rule Migration

Classify each scoped `AGENTS.md` line:

- keep the scope boundary and exact skill-routing table
- move stable codebase patterns and accepted architecture constraints into granular `.agents/rules/<scope>/` files
- remove duplicated rule bodies after indexing them
- keep workflow routing at its owning prompt or skill

Start with the narrowest scopes. Use current executable code or a durable accepted architecture decision as authority. Preserve project-owned rule files during scaffold and update. Finish when every scoped prompt has one exhaustive `.agents/rules/index.md` pointer and every migrated invariant has one authoritative body.
