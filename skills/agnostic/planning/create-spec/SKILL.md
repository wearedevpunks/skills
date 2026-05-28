---
name: create-spec
description: Create a SPEC.md file for a new feature, product, or system using the Spec-Driven Development (SDD) approach. The spec works in the problem space — it clarifies the "what", not the "how", and when backlog context exists it maps to one epic/capability and must unify all child-story requirements beneath it. Use this skill whenever the user wants to write a spec, define requirements, capture what needs to be built, create a specification document, or start the SDD workflow.
---

# Spec Creator

## Contract

- **Role:** higher-order spec authoring skill
- **Entrypoint type:** public entrypoint
- **Upstream:** new idea, feature request, epic/capability issue, or problem statement
- **Delegates to:** `$parallel-research` for split-friendly readonly discovery; `$requirements-grill` when discovery leaves meaningful spec-affecting unknowns; `$write-backlog` when the spec objective or grill outcomes change epic/story scope
- **Downstream:** reviewed `SPEC.md`, then usually `create-plan` or `implement-spec`
- **Entry conditions:** wiki root exists and a primary spec domain or project area can be resolved from existing specs, routed project docs, backlog context, or the user's request
- **Stop conditions:** `SPEC.md`, wiki index, and wiki log are updated, then wait for user review

This skill creates `SPEC.md` files that stay in the problem space: what to build, who it is for, why it matters, what counts as done, and what is out of scope.

When backlog context exists, one `SPEC.md` maps to one parent epic/capability issue and must cover the full scope of that epic. If the epic has child stories, the spec must explicitly incorporate and unify the requirements of all of them.

The output lives at `apps/wiki/specs/<domain>/<folder-name>/SPEC.md`.

## Quick start

1. Read `apps/wiki/AGENTS.md` first. Stop if the wiki is not bootstrapped.
2. Read `references/discovery.md` and orient yourself in the right spec domain or project area before asking questions.
3. When discovery spans independent code paths, docs, backlog items, prior specs, or hypotheses, read and use `$parallel-research` for readonly sidecar coverage before synthesizing.
4. If backlog context exists, read the parent epic and every child story before asking questions.
5. If the user did not provide a concrete request, ask for a rough description first.
6. Read `references/questioning.md` and ask only the lightweight clarifying questions needed to identify whether a grill phase is required.
7. If draft `Open Questions` would affect spec trust, read `references/grill-phase.md` and run a bounded `$requirements-grill` phase before writing.
8. If the requested objective, discovery, or grill changes accepted scope, child stories, deferred scope, story wording, or story order, read `references/backlog-sync.md` and run `$write-backlog` to sync the backlog automatically before final drafting.
9. Read `references/folder-naming.md` to resolve the domain and spec folder path.
10. Read `assets/SPEC-TEMPLATE.md` and write the spec.
11. Read `references/spec-quality-bar.md` before saving.
12. Read `references/wiki-bookkeeping.md` to update `index.md`, `<domain>-specs.md`, and `log.md`.
13. Read `references/handoff.md` to choose the next-step recommendation and stop after user review.

## Workflow

### Default workflow

1. Build orientation first; do not jump straight into writing.
2. Ask only enough to make the spec crisp, testable, and bounded.
3. Use `$parallel-research` when readonly orientation can be split cleanly across independent evidence sources; keep synthesis and spec decisions local.
4. When an epic has child stories, harvest and preserve each story's requirements before drafting.
5. Use `$requirements-grill` for meaningful spec-affecting unknowns; do not replace that phase with ad hoc `Open Questions` prompts.
6. Use `$write-backlog` automatically before final drafting when accepted spec direction implies backlog changes, whether that direction came from the user's objective, discovery, or a grill phase.
7. Keep the spec free of implementation detail.
8. Use the template structure exactly, then remove all template scaffolding.
9. Update wiki bookkeeping in the same run.
10. Stop after presenting the spec and the recommended next step.

## Advanced features

- Discovery and repo orientation: see [references/discovery.md](references/discovery.md)
- Clarifying-question strategy: see [references/questioning.md](references/questioning.md)
- Requirements grill phase: see [references/grill-phase.md](references/grill-phase.md)
- Backlog sync after grilling: see [references/backlog-sync.md](references/backlog-sync.md)
- Domain and folder naming rules: see [references/folder-naming.md](references/folder-naming.md)
- Acceptance-criteria and quality bar: see [references/spec-quality-bar.md](references/spec-quality-bar.md)
- Wiki index and log updates: see [references/wiki-bookkeeping.md](references/wiki-bookkeeping.md)
- Review closeout and next-step routing: see [references/handoff.md](references/handoff.md)
- Canonical backlog model: see [../write-backlog/assets/concepts/backlog-model.md](../write-backlog/assets/concepts/backlog-model.md)
