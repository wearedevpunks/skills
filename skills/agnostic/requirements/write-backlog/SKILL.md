---
name: write-backlog
description: Materialize provider-native backlog items. Use for Finder-selected pre-spec intake or an agent-ready post-spec delivery projection in Linear, GitHub Projects V2, Azure DevOps, or monday.com.
---

# Write Backlog

## Quick start

1. Choose one branch: pre-spec intake creation; update-existing branch to claim, release, or resolve a decision ticket; or delivery projection, which may create `epic` or `story` and requires an authoritative `SPEC.md` with `readiness: agent-ready` at a verified stable blob URL before any provider mutation.
2. Read `.devpunks/settings.json` and resolve the destination from `backlogProvider` plus `backlogProjectUrl`.
3. If either setting is missing, or `backlogProjectUrl` is not an absolute HTTP(S) URL, stop and ask the operator to run `hi ensure`. Do not discover or guess a backlog destination.
4. Read [REFERENCE.md](REFERENCE.md) and [assets/concepts/backlog-model.md](assets/concepts/backlog-model.md).
5. For intake, validate the complete intake dependency graph for missing targets, self-edges, and cycles before mutation; then materialize only the Finder-supplied description or question, route, dependencies, and claim state.
6. For delivery, use `backlog-shaper` only to draft the epic/story projection; keep final judgment in the parent thread.
7. Classify each item directly as `fog`, `grilling`, `research`, `prototype`, `epic`, or `story`.
8. Place `fog` at the backlog root; place concrete `grilling`, `research`, `prototype`, `epic`, and `story` items in a capability module. Keep capability grouping separate from execution milestones.
9. Project one capability-boundary epic from the existing `SPEC.md`; derive product-facing stories from its `US-###` and `AC-###` records.
10. Prove complete `US-###` / `AC-###` traceability and that each story is an agent-sized vertical tracer bullet.
11. Resolve every blocker target. Reject missing targets, self-blockers, and cycles, then derive chronological milestones from the blocker DAG.
12. Read the matching provider asset and validate the complete projection before the first provider write.
13. If any readiness check fails, stop with zero provider mutations and name every failure.
14. Once validation passes, write immediately without a separate approval stop.
15. Resolve pre-spec intake items through the provider adapter with an immutable resolution pointer to the spec; never silently promote one into the delivery epic.
16. Return created ids and URLs to `delivery-phase`; concrete planning remains downstream in `create-plan`.

## Item-count rule

Within durable capability modules, produce the fewest epics and stories that preserve all accepted requirements. Split only when merging would lose a distinct product outcome, acceptance signal, dependency, or provider boundary; otherwise fold requirements into the existing item body as scope, constraints, or acceptance signals.

## Direct taxonomy

Every supported concept is a first-class provider backlog item that is visible, assignable, searchable, linkable, and closeable.

- `fog`: root-level uncertainty; not delivery-eligible, not a `SPEC.md` anchor, and not an execution container.
- `grilling`: capability-module-scoped human decision work.
- `research`: capability-module-scoped readonly fact-finding.
- `prototype`: capability-module-scoped artifact or experiment learning.
- `epic`: capability-module-scoped projection of one authoritative `SPEC.md`.
- `story`: product-facing accepted implementation slice under one epic.

`grilling`, `research`, and `prototype` close with the answer or verdict, artifacts or evidence, observations, open decisions, and resolution pointer. Evidence returns to Wayfinder for reconciliation; closure does not authorize delivery.

## Workflows

### Pre-spec intake

1. Accept a Finder-selected direct classification: `fog`, `grilling`, `research`, or `prototype`.
2. For `fog`, preserve the frontier or uncertainty description. For `grilling`,
   `research`, or `prototype`, preserve the precise question. Also preserve the
   capability module when known, dependencies, claim state, and map link.
3. Validate the complete intake dependency graph for missing targets, self-edges, and cycles before the first provider write.
4. Create exactly the requested intake item. Do not create an epic or story.
5. Return the immutable provider id and URL to Finder.

### Agent-ready delivery projection

1. Read the authoritative spec, never raw grill artifacts as a substitute.
2. Project one epic and the fewest traceable vertical stories.
3. Validate the complete projection and blocker graph before mutation.
4. Write immediately when valid, then resolve any named intake item with the immutable spec link.

### Update-existing decision ticket

1. Require the provider id or URL plus the expected current claim state.
2. Read the existing item before mutation; fail on a conflicting claimant or stale state.
3. Use the matching provider adapter to claim, release, or resolve it.
4. Resolution requires an immutable resolution pointer and terminal outcome; claim/release changes only ownership state.
5. Return the updated id, URL, and observed state to Finder for reconciliation.

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
- Intake and post-spec delivery branches: see [REFERENCE.md](REFERENCE.md)
