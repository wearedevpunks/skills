---
name: write-backlog
description: Turns a large requirements discussion into a canonical backlog hierarchy of module/milestone -> epic/capability -> story and documents provider-specific issue creation payloads. Use when structuring backlog from discovery, breaking requirements into milestones/epics/stories, consuming `requirements-grill` artifacts like `*-grill-log.md` and `*-grill-status.md`, or preparing Linear, GitHub Issues, or Azure DevOps issue creation payloads.
---

# Write Backlog

## Quick start

1. Read [REFERENCE.md](REFERENCE.md) and [assets/concepts/backlog-model.md](assets/concepts/backlog-model.md).
2. If `requirements-grill` artifacts exist, read `*-grill-status.md` first and `*-grill-log.md` second.
3. Derive modules first, then epics, then stories.
4. Make story ordering explicit with native dependency primitives when the provider supports them.
5. Keep epic and story bodies product-facing.
6. Read the matching provider payload asset before generating or syncing create payloads.
7. Stop after the backlog structure and create payload guidance are complete.

## Workflows

### From a large requirements discussion

1. Normalize the input into durable modules.
2. Turn each module into a milestone or provider-equivalent container.
3. Create epic/capability items that each map to one future `SPEC.md`.
4. Break each epic into independently observable child stories.
5. Add native blockers between stories when order matters.

### From `requirements-grill` artifacts

1. Read `docs/<topic>-grill-status.md` first.
2. Read `docs/<topic>-grill-log.md` second.
3. Use the status file to identify:
   - active branches
   - branch completion
   - locked direction
   - still-open items
   - parked branches
4. Use the log to extract:
   - accepted decisions
   - superseded decisions
   - canonical terms
   - branch closure notes
5. Derive backlog only from locked direction and accepted decisions.
6. Treat parked branches and still-open items as explicit backlog notes or deferred follow-up, not silently resolved scope.

### From an existing messy backlog

1. Read the current hierarchy and item bodies first.
2. Collapse technical chores back into product-facing stories when possible.
3. Rebuild module -> epic -> story structure.
4. Keep execution detail out of epic and story bodies.

### Provider payload selection

1. Read the provider payload asset:
   - [Linear](assets/providers/linear-create-payload.md)
   - [GitHub Issues](assets/providers/github-issues-create-payload.md)
   - [Azure DevOps](assets/providers/azure-devops-create-payload.md)
2. Use the raw provider request shape documented there.
3. Do not invent provider fields from memory when the asset already defines them.

## Advanced features

- Canonical hierarchy and handoff contract: see [REFERENCE.md](REFERENCE.md)
- Backlog model and body ownership: see [assets/concepts/backlog-model.md](assets/concepts/backlog-model.md)
- Epic/story body shape: see [assets/concepts/story-shape.md](assets/concepts/story-shape.md)
- Provider create payloads: see [assets/providers/](assets/providers/)
- `requirements-grill` artifact ingestion: see [REFERENCE.md](REFERENCE.md)
