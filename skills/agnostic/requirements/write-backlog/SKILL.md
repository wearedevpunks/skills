---
name: write-backlog
description: Materialize canonical backlog kinds into provider-native items. Use when structuring fog, grilling, research, prototype, epic, or story items from discovery, wayfinder routes, requirements-grill artifacts, accepted decisions, or Linear, GitHub Projects V2, Azure DevOps, or monday.com payload needs.
---

# Write Backlog

## Quick start

1. Read [REFERENCE.md](REFERENCE.md) and [assets/concepts/backlog-model.md](assets/concepts/backlog-model.md).
2. If `requirements-grill` artifacts exist, read `*-grill-status.md` first and `*-grill-log.md` second.
3. If subagents are available and the source material is large, use `requirements-synthesizer` to compress accepted, rejected, superseded, parked, and unresolved decisions.
4. If subagents are available, use `backlog-shaper` for a draft module/epic/story hierarchy; keep final backlog judgment in the parent thread.
5. Derive the item kind first: `fog`, `grilling`, `research`, `prototype`, `epic`, or `story`.
6. Place `fog` at the backlog root; place concrete `grilling`, `research`, `prototype`, `epic`, and `story` items under a module/milestone.
7. Preserve delivery semantics: epics anchor future `SPEC.md`; stories remain product-facing children of epics.
8. Apply the item-count rule before finalizing implementation epics/stories.
9. Make story ordering explicit with native dependency primitives when the provider supports them.
10. Keep all item bodies product-facing and appropriate to their kind.
11. When approved design/prototype artifacts are source material, preserve approved artifact context and durable links in the relevant backlog items.
12. For visual assets, use `repo-asset-management`: prefer backlog attachments first, then repo-provider fallback links when attachments are unavailable or unsuitable.
13. Read the matching provider payload asset before generating or syncing create payloads.
14. Stop after the backlog structure and create payload guidance are complete.

## Item-count rule

Within durable modules, produce the fewest epics and stories that preserve all accepted requirements. Split only when merging would lose a distinct product outcome, acceptance signal, dependency, provider boundary, or future `SPEC.md` boundary; otherwise fold requirements into the existing item body as scope, constraints, or acceptance signals.

## Kind taxonomy

Every supported kind is a first-class provider backlog item that is visible, assignable, searchable, linkable, and closeable.

- `fog`: root-level uncertainty; not delivery-eligible, not a `SPEC.md` anchor, and not an execution container.
- `grilling`: module/milestone-scoped human decision work.
- `research`: module/milestone-scoped readonly fact-finding.
- `prototype`: module/milestone-scoped artifact or experiment learning.
- `epic`: module/milestone-scoped accepted implementation capability; anchors one future `SPEC.md`.
- `story`: product-facing accepted implementation slice under one epic.

`grilling`, `research`, and `prototype` close with an accepted decision note naming the answer, accepted direction, artifacts or evidence, and created or updated epics/stories.

## Workflows

### From a large requirements discussion

1. Normalize the input into durable modules.
2. Turn each module into a milestone or provider-equivalent container.
3. Create learning or uncertainty items when scope is not yet accepted.
4. Create epic/capability items only when implementation scope is accepted enough to map to one future `SPEC.md`.
5. Break each epic into independently observable child stories.
6. Add native blockers between stories when order matters.

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
3. Rebuild root fog plus module/milestone -> concrete item structure.
4. Keep execution detail out of backlog bodies.

### Provider payload selection

1. Read the provider payload asset:
   - [Linear](assets/providers/linear-create-payload.md)
   - [GitHub Projects and Issues](assets/providers/github-projects-create-payload.md)
   - [Azure DevOps](assets/providers/azure-devops-create-payload.md)
   - [monday.com](assets/providers/monday-create-payload.md)
2. Use the raw provider request shape documented there.
3. Do not invent provider fields from memory when the asset already defines them.

### Approved visual artifacts

1. Treat approved artifact links as backlog source evidence, not execution detail.
2. Attach approved visuals to the backlog item when the provider supports durable attachments.
3. If backlog attachments are unavailable, size-limited, or visibility-mismatched, use `repo-asset-management` for repo-provider durable links.
4. Include fallback links in epic/story bodies only as product-facing acceptance context.

## Advanced features

- Canonical hierarchy and handoff contract: see [REFERENCE.md](REFERENCE.md)
- Backlog model and body ownership: see [assets/concepts/backlog-model.md](assets/concepts/backlog-model.md)
- Epic/story body shape: see [assets/concepts/story-shape.md](assets/concepts/story-shape.md)
- Provider create payloads: see [assets/providers/](assets/providers/)
- `requirements-grill` artifact ingestion: see [REFERENCE.md](REFERENCE.md)
